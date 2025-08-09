import { EmailService } from './emailService';
import { EmailOptions, EmailResult, EmailError, EmailErrorType } from './types';
import { EmailErrorHandler } from './errorHandler';

export interface QueuedEmail {
  id: string;
  options: EmailOptions;
  priority: 'high' | 'normal' | 'low';
  attempts: number;
  maxAttempts: number;
  scheduledAt: Date;
  createdAt: Date;
  callback?: (result: EmailResult) => void;
  metadata?: Record<string, any>;
}

export interface QueueMetrics {
  totalQueued: number;
  totalProcessed: number;
  totalFailed: number;
  currentQueueSize: number;
  processingRate: number; // emails per minute
  averageProcessingTime: number; // milliseconds
  lastProcessedAt?: Date;
}

export interface RateLimitConfig {
  maxEmailsPerMinute: number;
  maxEmailsPerHour: number;
  maxConcurrentProcessing: number;
  burstAllowance: number; // Allow short bursts above the rate limit
}

export class AsyncEmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;
  private emailService: EmailService;
  private rateLimitConfig: RateLimitConfig;
  private metrics: QueueMetrics;
  private processingHistory: Date[] = []; // Track processing times for rate limiting
  private currentlyProcessing = 0;
  private processingTimes: number[] = []; // Track processing durations

  constructor(
    emailService: EmailService,
    rateLimitConfig: Partial<RateLimitConfig> = {}
  ) {
    this.emailService = emailService;
    this.rateLimitConfig = {
      maxEmailsPerMinute: 30, // Conservative default for Gmail SMTP
      maxEmailsPerHour: 500,
      maxConcurrentProcessing: 3,
      burstAllowance: 5,
      ...rateLimitConfig
    };
    
    this.metrics = {
      totalQueued: 0,
      totalProcessed: 0,
      totalFailed: 0,
      currentQueueSize: 0,
      processingRate: 0,
      averageProcessingTime: 0
    };

    // Start processing queue
    this.startProcessing();
  }

  /**
   * Adds an email to the queue for asynchronous processing
   * @param options - Email options
   * @param priority - Email priority (high, normal, low)
   * @param callback - Optional callback for when email is processed
   * @param metadata - Optional metadata for tracking
   * @returns Promise<string> - Queue ID for tracking
   */
  async queueEmail(
    options: EmailOptions,
    priority: 'high' | 'normal' | 'low' = 'normal',
    callback?: (result: EmailResult) => void,
    metadata?: Record<string, any>
  ): Promise<string> {
    const queueId = this.generateQueueId();
    
    const queuedEmail: QueuedEmail = {
      id: queueId,
      options,
      priority,
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: new Date(),
      createdAt: new Date(),
      callback,
      metadata
    };

    // Insert based on priority
    this.insertByPriority(queuedEmail);
    
    this.metrics.totalQueued++;
    this.metrics.currentQueueSize = this.queue.length;

    console.log(`Email queued for async processing: ${queueId} (priority: ${priority})`);
    
    return queueId;
  }

  /**
   * Processes emails in the queue with rate limiting
   */
  private async startProcessing(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;
    
    while (this.processing) {
      try {
        // Check if we can process more emails based on rate limits
        if (!this.canProcessEmail()) {
          await this.sleep(1000); // Wait 1 second before checking again
          continue;
        }

        // Get next email from queue
        const queuedEmail = this.getNextEmail();
        if (!queuedEmail) {
          await this.sleep(2000); // Wait 2 seconds if queue is empty
          continue;
        }

        // Process email asynchronously
        this.processEmailAsync(queuedEmail);
        
        // Small delay to prevent overwhelming the system
        await this.sleep(100);
        
      } catch (error) {
        console.error('Error in email queue processing loop:', error);
        await this.sleep(5000); // Wait 5 seconds on error
      }
    }
  }

  /**
   * Checks if we can process another email based on rate limits
   */
  private canProcessEmail(): boolean {
    const now = new Date();
    
    // Check concurrent processing limit
    if (this.currentlyProcessing >= this.rateLimitConfig.maxConcurrentProcessing) {
      return false;
    }

    // Clean old processing history (older than 1 hour)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    this.processingHistory = this.processingHistory.filter(time => time > oneHourAgo);

    // Check hourly limit
    if (this.processingHistory.length >= this.rateLimitConfig.maxEmailsPerHour) {
      return false;
    }

    // Check per-minute limit
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const recentProcessing = this.processingHistory.filter(time => time > oneMinuteAgo);
    
    if (recentProcessing.length >= this.rateLimitConfig.maxEmailsPerMinute) {
      // Check if we can use burst allowance
      const burstWindow = new Date(now.getTime() - 10 * 1000); // 10 second burst window
      const veryRecentProcessing = this.processingHistory.filter(time => time > burstWindow);
      
      if (veryRecentProcessing.length >= this.rateLimitConfig.burstAllowance) {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets the next email from the queue based on priority and scheduling
   */
  private getNextEmail(): QueuedEmail | null {
    const now = new Date();
    
    // Find the highest priority email that's ready to be processed
    for (let i = 0; i < this.queue.length; i++) {
      const email = this.queue[i];
      if (email.scheduledAt <= now) {
        this.queue.splice(i, 1);
        this.metrics.currentQueueSize = this.queue.length;
        return email;
      }
    }
    
    return null;
  }

  /**
   * Processes a single email asynchronously
   */
  private async processEmailAsync(queuedEmail: QueuedEmail): Promise<void> {
    this.currentlyProcessing++;
    const startTime = Date.now();
    
    try {
      console.log(`Processing queued email: ${queuedEmail.id} (attempt ${queuedEmail.attempts + 1})`);
      
      // Send the email
      const result = await this.emailService.sendEmail(queuedEmail.options);
      
      // Record processing time
      const processingTime = Date.now() - startTime;
      this.processingTimes.push(processingTime);
      if (this.processingTimes.length > 100) {
        this.processingTimes = this.processingTimes.slice(-100); // Keep last 100 measurements
      }
      
      // Update metrics
      this.processingHistory.push(new Date());
      this.metrics.lastProcessedAt = new Date();
      this.updateMetrics();
      
      if (result.success) {
        this.metrics.totalProcessed++;
        console.log(`Email processed successfully: ${queuedEmail.id} (${processingTime}ms)`);
      } else {
        await this.handleEmailFailure(queuedEmail, result.error);
      }
      
      // Call callback if provided
      if (queuedEmail.callback) {
        try {
          queuedEmail.callback(result);
        } catch (callbackError) {
          console.error('Error in email callback:', callbackError);
        }
      }
      
    } catch (error) {
      console.error(`Error processing queued email ${queuedEmail.id}:`, error);
      
      const emailError = EmailErrorHandler.handleError(
        error as Error,
        { queueId: queuedEmail.id, operation: 'queue_processing' }
      );
      
      await this.handleEmailFailure(queuedEmail, emailError);
      
    } finally {
      this.currentlyProcessing--;
    }
  }

  /**
   * Handles email processing failures with retry logic
   */
  private async handleEmailFailure(queuedEmail: QueuedEmail, error?: EmailError): Promise<void> {
    queuedEmail.attempts++;
    
    // Check if we should retry
    const shouldRetry = error ? EmailErrorHandler.shouldRetry(error) : true;
    const hasAttemptsLeft = queuedEmail.attempts < queuedEmail.maxAttempts;
    
    if (shouldRetry && hasAttemptsLeft) {
      // Calculate retry delay with exponential backoff
      const baseDelay = 1000; // 1 second base delay
      const retryDelay = baseDelay * Math.pow(2, queuedEmail.attempts - 1);
      const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
      const totalDelay = retryDelay + jitter;
      
      // Schedule retry
      queuedEmail.scheduledAt = new Date(Date.now() + totalDelay);
      this.insertByPriority(queuedEmail);
      
      console.log(`Email ${queuedEmail.id} failed, retrying in ${Math.round(totalDelay)}ms (attempt ${queuedEmail.attempts}/${queuedEmail.maxAttempts})`);
      
    } else {
      // Max attempts reached or non-retryable error
      this.metrics.totalFailed++;
      console.error(`Email ${queuedEmail.id} failed permanently after ${queuedEmail.attempts} attempts:`, error?.message);
      
      // Call callback with failure result
      if (queuedEmail.callback) {
        try {
          const failureResult: EmailResult = {
            success: false,
            error,
            retryCount: queuedEmail.attempts,
            timestamp: new Date(),
            recipient: queuedEmail.options.to,
            subject: queuedEmail.options.subject
          };
          queuedEmail.callback(failureResult);
        } catch (callbackError) {
          console.error('Error in email failure callback:', callbackError);
        }
      }
    }
  }

  /**
   * Inserts email into queue based on priority
   */
  private insertByPriority(queuedEmail: QueuedEmail): void {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const emailPriority = priorityOrder[queuedEmail.priority];
    
    let insertIndex = this.queue.length;
    
    for (let i = 0; i < this.queue.length; i++) {
      const queuePriority = priorityOrder[this.queue[i].priority];
      if (emailPriority < queuePriority) {
        insertIndex = i;
        break;
      }
    }
    
    this.queue.splice(insertIndex, 0, queuedEmail);
    this.metrics.currentQueueSize = this.queue.length;
  }

  /**
   * Updates processing metrics
   */
  private updateMetrics(): void {
    // Calculate processing rate (emails per minute)
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const recentProcessing = this.processingHistory.filter(time => time > oneMinuteAgo);
    this.metrics.processingRate = recentProcessing.length;
    
    // Calculate average processing time
    if (this.processingTimes.length > 0) {
      const sum = this.processingTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageProcessingTime = sum / this.processingTimes.length;
    }
  }

  /**
   * Generates a unique queue ID
   */
  private generateQueueId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Utility function to sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gets current queue metrics
   */
  getMetrics(): QueueMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * Gets current queue status
   */
  getQueueStatus(): {
    queueSize: number;
    processing: boolean;
    currentlyProcessing: number;
    nextScheduledEmail?: Date;
    rateLimitConfig: RateLimitConfig;
  } {
    const nextEmail = this.queue.length > 0 ? this.queue[0] : null;
    
    return {
      queueSize: this.queue.length,
      processing: this.processing,
      currentlyProcessing: this.currentlyProcessing,
      nextScheduledEmail: nextEmail?.scheduledAt,
      rateLimitConfig: this.rateLimitConfig
    };
  }

  /**
   * Stops the queue processing (for graceful shutdown)
   */
  stop(): void {
    this.processing = false;
    console.log('Email queue processing stopped');
  }

  /**
   * Clears all emails from the queue
   */
  clearQueue(): void {
    this.queue = [];
    this.metrics.currentQueueSize = 0;
    console.log('Email queue cleared');
  }

  /**
   * Gets emails currently in queue (for monitoring)
   */
  getQueuedEmails(): Array<{
    id: string;
    recipient: string;
    subject: string;
    priority: string;
    attempts: number;
    scheduledAt: Date;
    createdAt: Date;
  }> {
    return this.queue.map(email => ({
      id: email.id,
      recipient: email.options.to,
      subject: email.options.subject,
      priority: email.priority,
      attempts: email.attempts,
      scheduledAt: email.scheduledAt,
      createdAt: email.createdAt
    }));
  }
}

// Singleton instance - will be initialized when first imported
let asyncEmailQueueInstance: AsyncEmailQueue | null = null;

/**
 * Gets or creates the async email queue singleton
 */
export function getAsyncEmailQueue(): AsyncEmailQueue {
  if (!asyncEmailQueueInstance) {
    // Import emailService here to avoid circular dependency
    const { emailService } = require('./emailService');
    
    asyncEmailQueueInstance = new AsyncEmailQueue(
      emailService,
      {
        maxEmailsPerMinute: 25, // Conservative for Gmail SMTP
        maxEmailsPerHour: 400,
        maxConcurrentProcessing: 2,
        burstAllowance: 3
      }
    );
  }
  
  return asyncEmailQueueInstance;
}

// Export the getter function as the main export
export const asyncEmailQueue = getAsyncEmailQueue();