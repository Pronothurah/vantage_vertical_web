/**
 * Touch Gesture Utilities for Mobile Menu
 * 
 * This module provides touch gesture support and momentum scrolling for the mobile navigation menu,
 * ensuring smooth touch interactions and preventing conflicts with page scrolling.
 */

import React from 'react';
import { 
  addPassiveEventListener, 
  MobileMenuErrorBoundary,
  PerformanceMonitor,
  RAFScheduler 
} from './performanceUtils';

export interface TouchGestureConfig {
  // Momentum scrolling settings
  momentumEnabled: boolean;
  momentumDecay: number;        // Decay factor for momentum (0-1)
  momentumThreshold: number;    // Minimum velocity to trigger momentum
  momentumMaxDuration: number;  // Maximum momentum animation duration (ms)
  
  // Touch sensitivity settings
  touchSensitivity: number;     // Multiplier for touch scroll distance
  swipeThreshold: number;       // Minimum distance for swipe detection (px)
  swipeVelocityThreshold: number; // Minimum velocity for swipe (px/ms)
  
  // Scroll boundary settings
  bounceEnabled: boolean;       // Enable bounce effect at boundaries
  bounceDistance: number;       // Maximum bounce distance (px)
  bounceDecay: number;         // Bounce decay factor (0-1)
  
  // Performance settings
  passiveListeners: boolean;    // Use passive event listeners
  preventPageScroll: boolean;   // Prevent page scrolling when menu is scrolling
  touchActionNone: boolean;     // Set touch-action: none on container
}

export interface TouchState {
  isActive: boolean;
  startY: number;
  currentY: number;
  lastY: number;
  startTime: number;
  lastTime: number;
  velocity: number;
  distance: number;
  direction: 'up' | 'down' | null;
}

export interface MomentumState {
  isActive: boolean;
  startVelocity: number;
  currentVelocity: number;
  startTime: number;
  animationId: number | null;
}

const DEFAULT_TOUCH_CONFIG: TouchGestureConfig = {
  momentumEnabled: true,
  momentumDecay: 0.95,
  momentumThreshold: 0.5, // px/ms
  momentumMaxDuration: 2000,
  
  touchSensitivity: 1.0,
  swipeThreshold: 30,
  swipeVelocityThreshold: 0.3,
  
  bounceEnabled: true,
  bounceDistance: 50,
  bounceDecay: 0.88,
  
  passiveListeners: true,
  preventPageScroll: true,
  touchActionNone: true,
};

/**
 * Touch Gesture Manager Class
 * Handles all touch interactions for the mobile menu
 */
export class TouchGestureManager {
  private container: HTMLElement;
  private config: TouchGestureConfig;
  private touchState: TouchState;
  private momentumState: MomentumState;
  private boundHandlers: Map<string, EventListener | (() => void)>;
  private isDestroyed: boolean = false;
  private performanceMonitor: PerformanceMonitor | null = null;
  private errorBoundary: MobileMenuErrorBoundary | null = null;
  private rafScheduler: RAFScheduler | null = null;

  constructor(container: HTMLElement, config: Partial<TouchGestureConfig> = {}) {
    this.container = container;
    this.config = { ...DEFAULT_TOUCH_CONFIG, ...config };
    this.touchState = this.createInitialTouchState();
    this.momentumState = this.createInitialMomentumState();
    this.boundHandlers = new Map();
    
    // Initialize performance monitoring and error handling
    this.initializePerformanceMonitoring();
    this.setupTouchHandlers();
    this.setupContainerStyles();
  }

  private initializePerformanceMonitoring(): void {
    this.performanceMonitor = new PerformanceMonitor(
      { minFrameRate: 55, maxFrameTime: 18, maxDroppedFrames: 3 },
      (metrics) => {
        console.warn('Touch gesture performance degradation:', metrics);
      }
    );

    this.errorBoundary = new MobileMenuErrorBoundary(
      3,
      (error, errorInfo) => {
        console.error('Touch gesture error:', error, errorInfo);
      }
    );

    this.rafScheduler = new RAFScheduler();
  }

  private createInitialTouchState(): TouchState {
    return {
      isActive: false,
      startY: 0,
      currentY: 0,
      lastY: 0,
      startTime: 0,
      lastTime: 0,
      velocity: 0,
      distance: 0,
      direction: null,
    };
  }

  private createInitialMomentumState(): MomentumState {
    return {
      isActive: false,
      startVelocity: 0,
      currentVelocity: 0,
      startTime: 0,
      animationId: null,
    };
  }

  private setupContainerStyles(): void {
    if (this.config.touchActionNone) {
      this.container.style.touchAction = 'pan-y';
    }
    
    // Ensure container is scrollable
    if (this.container.style.overflowY !== 'auto') {
      this.container.style.overflowY = 'auto';
    }
  }

  private setupTouchHandlers(): void {
    const passiveOptions: AddEventListenerOptions = this.config.passiveListeners ? { passive: false } : {};
    const regularOptions: AddEventListenerOptions | boolean = this.config.passiveListeners ? { passive: false } : false;
    
    // Bind handlers to maintain context with error handling
    const handleTouchStart = this.errorBoundary?.wrapFunction(
      this.handleTouchStart.bind(this),
      'touch'
    ) || this.handleTouchStart.bind(this);
    
    const handleTouchMove = this.errorBoundary?.wrapFunction(
      this.handleTouchMove.bind(this),
      'touch'
    ) || this.handleTouchMove.bind(this);
    
    const handleTouchEnd = this.errorBoundary?.wrapFunction(
      this.handleTouchEnd.bind(this),
      'touch'
    ) || this.handleTouchEnd.bind(this);
    
    const handleTouchCancel = this.errorBoundary?.wrapFunction(
      this.handleTouchCancel.bind(this),
      'touch'
    ) || this.handleTouchCancel.bind(this);
    
    // Store bound handlers for cleanup
    this.boundHandlers.set('touchstart', handleTouchStart as EventListener);
    this.boundHandlers.set('touchmove', handleTouchMove as EventListener);
    this.boundHandlers.set('touchend', handleTouchEnd as EventListener);
    this.boundHandlers.set('touchcancel', handleTouchCancel as EventListener);
    
    // Add passive event listeners with cleanup functions
    if (this.config.passiveListeners) {
      this.boundHandlers.set('touchstart-cleanup', addPassiveEventListener(
        this.container, 'touchstart', handleTouchStart as EventListener, passiveOptions
      ));
      this.boundHandlers.set('touchmove-cleanup', addPassiveEventListener(
        this.container, 'touchmove', handleTouchMove as EventListener, passiveOptions
      ));
      this.boundHandlers.set('touchend-cleanup', addPassiveEventListener(
        this.container, 'touchend', handleTouchEnd as EventListener, passiveOptions
      ));
      this.boundHandlers.set('touchcancel-cleanup', addPassiveEventListener(
        this.container, 'touchcancel', handleTouchCancel as EventListener, passiveOptions
      ));
    } else {
      // Fallback to regular event listeners
      this.container.addEventListener('touchstart', handleTouchStart as EventListener, regularOptions);
      this.container.addEventListener('touchmove', handleTouchMove as EventListener, regularOptions);
      this.container.addEventListener('touchend', handleTouchEnd as EventListener, regularOptions);
      this.container.addEventListener('touchcancel', handleTouchCancel as EventListener, regularOptions);
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    if (this.isDestroyed || event.touches.length !== 1) return;
    
    // Stop any ongoing momentum
    this.stopMomentum();
    
    const touch = event.touches[0];
    const now = Date.now();
    
    this.touchState = {
      isActive: true,
      startY: touch.clientY,
      currentY: touch.clientY,
      lastY: touch.clientY,
      startTime: now,
      lastTime: now,
      velocity: 0,
      distance: 0,
      direction: null,
    };
  }

  private handleTouchMove(event: TouchEvent): void {
    if (this.isDestroyed || !this.touchState.isActive || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    const now = Date.now();
    const deltaTime = now - this.touchState.lastTime;
    
    if (deltaTime === 0) return; // Avoid division by zero
    
    const deltaY = touch.clientY - this.touchState.lastY;
    const totalDistance = touch.clientY - this.touchState.startY;
    
    // Calculate velocity (px/ms)
    this.touchState.velocity = deltaY / deltaTime;
    this.touchState.distance = totalDistance;
    this.touchState.direction = deltaY > 0 ? 'down' : 'up';
    
    // Apply touch sensitivity
    const scrollDelta = -deltaY * this.config.touchSensitivity;
    
    // Check if we should prevent page scrolling
    if (this.config.preventPageScroll && this.shouldPreventPageScroll(scrollDelta)) {
      event.preventDefault();
    }
    
    // Apply scroll with boundary handling
    this.applyScroll(scrollDelta);
    
    // Update touch state
    this.touchState.currentY = touch.clientY;
    this.touchState.lastY = touch.clientY;
    this.touchState.lastTime = now;
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (this.isDestroyed || !this.touchState.isActive) return;
    
    const totalTime = Date.now() - this.touchState.startTime;
    const totalDistance = Math.abs(this.touchState.distance);
    
    // Check for swipe gesture
    if (this.isSwipeGesture(totalDistance, totalTime)) {
      this.handleSwipeGesture();
    }
    
    // Start momentum scrolling if enabled and velocity is sufficient
    if (this.config.momentumEnabled && Math.abs(this.touchState.velocity) > this.config.momentumThreshold) {
      this.startMomentum();
    }
    
    this.touchState.isActive = false;
  }

  private handleTouchCancel(event: TouchEvent): void {
    if (this.isDestroyed) return;
    
    this.touchState.isActive = false;
    this.stopMomentum();
  }

  private shouldPreventPageScroll(scrollDelta: number): boolean {
    const { scrollTop, scrollHeight, clientHeight } = this.container;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop >= scrollHeight - clientHeight;
    
    // Prevent page scroll if:
    // 1. Scrolling down and not at top
    // 2. Scrolling up and not at bottom
    // 3. Container is scrollable
    return (scrollDelta > 0 && !isAtTop) || (scrollDelta < 0 && !isAtBottom) || (scrollHeight > clientHeight);
  }

  private applyScroll(delta: number): void {
    const { scrollTop, scrollHeight, clientHeight } = this.container;
    const maxScroll = scrollHeight - clientHeight;
    
    let newScrollTop = scrollTop + delta;
    
    // Handle bounce at boundaries
    if (this.config.bounceEnabled) {
      if (newScrollTop < 0) {
        // Bounce at top
        const bounceAmount = Math.min(Math.abs(newScrollTop), this.config.bounceDistance);
        newScrollTop = -bounceAmount * this.config.bounceDecay;
      } else if (newScrollTop > maxScroll) {
        // Bounce at bottom
        const bounceAmount = Math.min(newScrollTop - maxScroll, this.config.bounceDistance);
        newScrollTop = maxScroll + bounceAmount * this.config.bounceDecay;
      }
    } else {
      // Clamp to boundaries
      newScrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
    }
    
    this.container.scrollTop = newScrollTop;
  }

  private isSwipeGesture(distance: number, time: number): boolean {
    const velocity = distance / time; // px/ms
    return distance >= this.config.swipeThreshold && velocity >= this.config.swipeVelocityThreshold;
  }

  private handleSwipeGesture(): void {
    // For now, swipe gestures just trigger momentum
    // Could be extended for specific swipe actions like closing menu
    if (this.config.momentumEnabled) {
      this.startMomentum();
    }
  }

  private startMomentum(): void {
    if (this.momentumState.isActive) {
      this.stopMomentum();
    }
    
    this.momentumState = {
      isActive: true,
      startVelocity: this.touchState.velocity,
      currentVelocity: this.touchState.velocity,
      startTime: Date.now(),
      animationId: null,
    };
    
    this.animateMomentum();
  }

  private animateMomentum(): void {
    if (!this.momentumState.isActive || this.isDestroyed) return;
    
    const now = Date.now();
    const elapsed = now - this.momentumState.startTime;
    
    // Stop momentum if max duration reached or velocity too low
    if (elapsed > this.config.momentumMaxDuration || Math.abs(this.momentumState.currentVelocity) < 0.01) {
      this.stopMomentum();
      return;
    }
    
    // Apply momentum decay
    this.momentumState.currentVelocity *= this.config.momentumDecay;
    
    // Calculate scroll delta (convert velocity from px/ms to px/frame assuming 60fps)
    const scrollDelta = -this.momentumState.currentVelocity * 16.67; // 1000ms/60fps ≈ 16.67ms
    
    // Apply scroll
    this.applyScroll(scrollDelta);
    
    // Continue animation
    this.momentumState.animationId = requestAnimationFrame(() => this.animateMomentum());
  }

  private stopMomentum(): void {
    if (this.momentumState.animationId) {
      cancelAnimationFrame(this.momentumState.animationId);
    }
    
    this.momentumState = this.createInitialMomentumState();
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<TouchGestureConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupContainerStyles();
  }

  /**
   * Get current touch state (for debugging/monitoring)
   */
  public getTouchState(): Readonly<TouchState> {
    return { ...this.touchState };
  }

  /**
   * Get current momentum state (for debugging/monitoring)
   */
  public getMomentumState(): Readonly<MomentumState> {
    return { ...this.momentumState };
  }

  /**
   * Check if touch gestures are currently active
   */
  public isActive(): boolean {
    return this.touchState.isActive || this.momentumState.isActive;
  }

  /**
   * Destroy the touch gesture manager and clean up
   */
  public destroy(): void {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    
    // Stop momentum
    this.stopMomentum();
    
    // Clean up performance monitoring
    this.performanceMonitor?.destroy();
    this.errorBoundary?.reset();
    this.rafScheduler?.destroy();
    
    // Remove event listeners - handle both passive and regular listeners
    this.boundHandlers.forEach((handler, key) => {
      if (key.endsWith('-cleanup')) {
        // This is a cleanup function from addPassiveEventListener
        (handler as () => void)();
      } else if (!key.endsWith('-cleanup')) {
        // This is a regular event listener
        this.container.removeEventListener(key, handler as EventListener);
      }
    });
    
    this.boundHandlers.clear();
    
    // Reset container styles
    this.container.style.touchAction = '';
  }
}

/**
 * React hook for touch gesture management
 */
export function useTouchGestures(
  containerRef: React.RefObject<HTMLElement>,
  config: Partial<TouchGestureConfig> = {},
  enabled: boolean = true
) {
  const managerRef = React.useRef<TouchGestureManager | null>(null);
  const configRef = React.useRef(config);
  
  // Update config ref when config changes
  React.useEffect(() => {
    configRef.current = config;
    if (managerRef.current) {
      managerRef.current.updateConfig(config);
    }
  }, [config]);
  
  // Setup/cleanup touch gesture manager
  React.useEffect(() => {
    if (!enabled || !containerRef.current) {
      if (managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
      return;
    }
    
    // Create new manager
    managerRef.current = new TouchGestureManager(containerRef.current, configRef.current);
    
    // Cleanup on unmount or dependency change
    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
    };
  }, [containerRef, enabled]);
  
  // Get current states
  const getTouchState = React.useCallback(() => {
    return managerRef.current?.getTouchState() || null;
  }, []);
  
  const getMomentumState = React.useCallback(() => {
    return managerRef.current?.getMomentumState() || null;
  }, []);
  
  const isActive = React.useCallback(() => {
    return managerRef.current?.isActive() || false;
  }, []);
  
  return {
    getTouchState,
    getMomentumState,
    isActive,
  };
}

/**
 * Utility function to detect if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - Legacy property
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Utility function to get optimal touch configuration based on device
 */
export function getOptimalTouchConfig(): Partial<TouchGestureConfig> {
  if (typeof window === 'undefined') return {};
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  const config: Partial<TouchGestureConfig> = {};
  
  // iOS-specific optimizations
  if (isIOS) {
    config.momentumDecay = 0.92; // Slightly less momentum on iOS
    config.bounceEnabled = true; // iOS users expect bounce
    config.touchActionNone = false; // Let iOS handle touch-action
  }
  
  // Android-specific optimizations
  if (isAndroid) {
    config.momentumDecay = 0.95; // More momentum on Android
    config.touchSensitivity = 1.1; // Slightly more sensitive
  }
  
  // Safari-specific optimizations
  if (isSafari) {
    config.passiveListeners = false; // Safari has issues with passive listeners
  }
  
  return config;
}