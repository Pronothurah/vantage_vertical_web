import { EmailTemplate, BaseTemplateData, TemplateOptions } from './types';

/**
 * Template cache entry interface
 */
interface CacheEntry {
  template: EmailTemplate;
  createdAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

/**
 * Template cache configuration
 */
interface CacheConfig {
  maxSize: number;
  ttlMs: number; // Time to live in milliseconds
  cleanupIntervalMs: number;
}

/**
 * Template rendering performance metrics
 */
interface RenderingMetrics {
  totalRenders: number;
  cacheHits: number;
  cacheMisses: number;
  averageRenderTime: number;
  renderTimes: number[];
}

/**
 * High-performance template cache with LRU eviction and automatic cleanup
 */
export class TemplateCache {
  private cache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private metrics: RenderingMetrics;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100, // Cache up to 100 templates
      ttlMs: 30 * 60 * 1000, // 30 minutes TTL
      cleanupIntervalMs: 5 * 60 * 1000, // Cleanup every 5 minutes
      ...config
    };

    this.metrics = {
      totalRenders: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageRenderTime: 0,
      renderTimes: []
    };

    this.startCleanupTimer();
  }

  /**
   * Generates a cache key for template parameters
   */
  private generateCacheKey(
    templateType: string,
    data: BaseTemplateData,
    options: TemplateOptions = {}
  ): string {
    // Create a deterministic key based on template parameters
    const keyData = {
      type: templateType,
      companyName: data.companyName,
      logoUrl: data.logoUrl,
      websiteUrl: data.websiteUrl,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      unsubscribeUrl: data.unsubscribeUrl,
      options: {
        includeHeader: options.includeHeader,
        includeFooter: options.includeFooter,
        backgroundColor: options.backgroundColor,
        primaryColor: options.primaryColor,
        textColor: options.textColor,
        linkColor: options.linkColor,
        buttonStyle: options.buttonStyle
      }
    };

    // Create hash of the key data
    return this.hashObject(keyData);
  }

  /**
   * Simple hash function for objects
   */
  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Gets a template from cache or returns null if not found/expired
   */
  get(
    templateType: string,
    data: BaseTemplateData,
    options: TemplateOptions = {}
  ): EmailTemplate | null {
    const key = this.generateCacheKey(templateType, data, options);
    const entry = this.cache.get(key);

    if (!entry) {
      this.metrics.cacheMisses++;
      return null;
    }

    // Check if entry is expired
    const now = new Date();
    if (now.getTime() - entry.createdAt.getTime() > this.config.ttlMs) {
      this.cache.delete(key);
      this.metrics.cacheMisses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.metrics.cacheHits++;

    return entry.template;
  }

  /**
   * Stores a template in cache
   */
  set(
    templateType: string,
    data: BaseTemplateData,
    template: EmailTemplate,
    options: TemplateOptions = {}
  ): void {
    const key = this.generateCacheKey(templateType, data, options);
    const now = new Date();

    // Check if cache is full and needs eviction
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry = {
      template,
      createdAt: now,
      accessCount: 1,
      lastAccessed: now
    };

    this.cache.set(key, entry);
  }

  /**
   * Renders a template with caching and performance tracking
   */
  async renderTemplate<T extends Record<string, any>>(
    templateType: string,
    renderFunction: (data: T) => EmailTemplate | Promise<EmailTemplate>,
    data: T,
    baseData: BaseTemplateData,
    options: TemplateOptions = {}
  ): Promise<EmailTemplate> {
    const startTime = Date.now();
    this.metrics.totalRenders++;

    // Try to get from cache first
    const cached = this.get(templateType, baseData, options);
    if (cached) {
      // For cached templates, we still need to replace dynamic content
      const dynamicTemplate = this.replaceDynamicContent(cached, data);
      this.recordRenderTime(Date.now() - startTime);
      return dynamicTemplate;
    }

    // Render new template
    const template = await renderFunction(data);
    
    // Cache the template (without dynamic content)
    this.set(templateType, baseData, template, options);

    // Replace dynamic content
    const finalTemplate = this.replaceDynamicContent(template, data);
    
    this.recordRenderTime(Date.now() - startTime);
    return finalTemplate;
  }

  /**
   * Replaces dynamic content in cached templates
   */
  private replaceDynamicContent<T extends Record<string, any>>(
    template: EmailTemplate,
    data: T
  ): EmailTemplate {
    let html = template.html;
    let text = template.text;
    let subject = template.subject;

    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        const placeholder = `{{${key}}}`;
        const stringValue = String(value);
        
        html = html.replace(new RegExp(placeholder, 'g'), stringValue);
        text = text.replace(new RegExp(placeholder, 'g'), stringValue);
        subject = subject.replace(new RegExp(placeholder, 'g'), stringValue);
      }
    });

    return { html, text, subject };
  }

  /**
   * Records render time for performance metrics
   */
  private recordRenderTime(renderTime: number): void {
    this.metrics.renderTimes.push(renderTime);
    
    // Keep only last 100 measurements
    if (this.metrics.renderTimes.length > 100) {
      this.metrics.renderTimes = this.metrics.renderTimes.slice(-100);
    }

    // Update average
    const sum = this.metrics.renderTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageRenderTime = sum / this.metrics.renderTimes.length;
  }

  /**
   * Evicts the least recently used entry from cache
   */
  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    // Convert to array to avoid iterator issues
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (entry.lastAccessed.getTime() < oldestTime) {
        oldestTime = entry.lastAccessed.getTime();
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Starts the automatic cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupIntervalMs);
  }

  /**
   * Cleans up expired entries from cache
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Convert to array to avoid iterator issues
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.createdAt.getTime() > this.config.ttlMs) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`Template cache cleanup: removed ${expiredKeys.length} expired entries`);
    }
  }

  /**
   * Gets cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    metrics: RenderingMetrics;
  } {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    const hitRate = totalRequests > 0 ? this.metrics.cacheHits / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      metrics: { ...this.metrics }
    };
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache.clear();
    console.log('Template cache cleared');
  }

  /**
   * Stops the cleanup timer (for graceful shutdown)
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }

  /**
   * Preloads common templates into cache
   */
  async preloadCommonTemplates(): Promise<void> {
    // This would be called during application startup to preload
    // frequently used templates with default configurations
    console.log('Template cache preloading started');
    
    // Add preloading logic here if needed
    // For now, we'll let templates be cached on first use
    
    console.log('Template cache preloading completed');
  }
}

// Export singleton instance
export const templateCache = new TemplateCache({
  maxSize: 50, // Smaller cache for production
  ttlMs: 15 * 60 * 1000, // 15 minutes TTL
  cleanupIntervalMs: 10 * 60 * 1000 // Cleanup every 10 minutes
});

/**
 * Template rendering utilities with performance optimization
 */
export class OptimizedTemplateRenderer {
  private cache: TemplateCache;

  constructor(cache: TemplateCache = templateCache) {
    this.cache = cache;
  }

  /**
   * Renders a template with caching and optimization
   */
  async render<T extends Record<string, any>>(
    templateType: string,
    renderFunction: (data: T) => EmailTemplate | Promise<EmailTemplate>,
    data: T,
    baseData: BaseTemplateData,
    options: TemplateOptions = {}
  ): Promise<EmailTemplate> {
    return this.cache.renderTemplate(
      templateType,
      renderFunction,
      data,
      baseData,
      options
    );
  }

  /**
   * Batch renders multiple templates efficiently
   */
  async renderBatch<T extends Record<string, any>>(
    requests: Array<{
      templateType: string;
      renderFunction: (data: T) => EmailTemplate | Promise<EmailTemplate>;
      data: T;
      baseData: BaseTemplateData;
      options?: TemplateOptions;
    }>
  ): Promise<EmailTemplate[]> {
    // Process templates in parallel for better performance
    const renderPromises = requests.map(request =>
      this.render(
        request.templateType,
        request.renderFunction,
        request.data,
        request.baseData,
        request.options || {}
      )
    );

    return Promise.all(renderPromises);
  }

  /**
   * Gets rendering performance statistics
   */
  getPerformanceStats() {
    return this.cache.getStats();
  }
}

// Export singleton renderer
export const optimizedRenderer = new OptimizedTemplateRenderer();