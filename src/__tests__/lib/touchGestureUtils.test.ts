/**
 * Tests for Touch Gesture Utilities
 * 
 * Tests touch gesture support and momentum scrolling functionality
 * for the mobile navigation menu.
 */

import { TouchGestureManager, isTouchDevice, getOptimalTouchConfig } from '@/lib/touchGestureUtils';

// Mock DOM methods
const mockScrollTo = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockRequestAnimationFrame = jest.fn();
const mockCancelAnimationFrame = jest.fn();

// Mock container element
const createMockContainer = () => ({
  scrollTop: 0,
  scrollHeight: 1000,
  clientHeight: 400,
  style: {},
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  scrollTo: mockScrollTo,
});

// Mock touch event
const createMockTouchEvent = (clientY: number, timeStamp: number = Date.now()) => ({
  touches: [{ clientY }],
  preventDefault: jest.fn(),
  timeStamp,
});

describe('TouchGestureUtils', () => {
  let mockContainer: any;
  let touchManager: TouchGestureManager;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContainer = createMockContainer();
    
    // Mock global functions
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;
    global.Date.now = jest.fn(() => 1000);
    
    // Mock requestAnimationFrame to call callback immediately
    mockRequestAnimationFrame.mockImplementation((callback) => {
      callback();
      return 1;
    });
  });

  afterEach(() => {
    if (touchManager) {
      touchManager.destroy();
    }
  });

  describe('TouchGestureManager', () => {
    it('should initialize with default configuration', () => {
      touchManager = new TouchGestureManager(mockContainer);
      
      expect(mockContainer.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: false });
      expect(mockContainer.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false });
      expect(mockContainer.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), { passive: false });
      expect(mockContainer.addEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function), { passive: false });
    });

    it('should set up container styles for touch optimization', () => {
      touchManager = new TouchGestureManager(mockContainer);
      
      expect(mockContainer.style.touchAction).toBe('pan-y');
      expect(mockContainer.style.overflowY).toBe('auto');
    });

    it('should handle touch start events', () => {
      touchManager = new TouchGestureManager(mockContainer);
      const touchState = touchManager.getTouchState();
      
      expect(touchState.isActive).toBe(false);
      
      // Simulate touch start
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      
      const touchEvent = createMockTouchEvent(100);
      touchStartHandler(touchEvent);
      
      const newTouchState = touchManager.getTouchState();
      expect(newTouchState.isActive).toBe(true);
      expect(newTouchState.startY).toBe(100);
    });

    it('should calculate velocity during touch move', () => {
      touchManager = new TouchGestureManager(mockContainer);
      
      // Get event handlers
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      const touchMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )[1];
      
      // Start touch
      touchStartHandler(createMockTouchEvent(100, 1000));
      
      // Move touch
      global.Date.now = jest.fn(() => 1050); // 50ms later
      touchMoveHandler(createMockTouchEvent(150, 1050)); // 50px down
      
      const touchState = touchManager.getTouchState();
      expect(touchState.velocity).toBe(1); // 50px / 50ms = 1 px/ms
      expect(touchState.direction).toBe('down');
    });

    it('should prevent page scroll when appropriate', () => {
      touchManager = new TouchGestureManager(mockContainer, {
        preventPageScroll: true
      });
      
      // Set container to be scrollable and not at top
      mockContainer.scrollTop = 50;
      mockContainer.scrollHeight = 1000;
      mockContainer.clientHeight = 400;
      
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      const touchMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )[1];
      
      // Start touch first
      touchStartHandler(createMockTouchEvent(120, 1000));
      
      // Create touch move event with preventDefault mock
      const touchEvent = {
        touches: [{ clientY: 100 }],
        preventDefault: jest.fn(),
      };
      
      // Mock Date.now for consistent timing
      global.Date.now = jest.fn(() => 1050);
      
      // Move touch up (should prevent page scroll)
      touchMoveHandler(touchEvent);
      
      expect(touchEvent.preventDefault).toHaveBeenCalled();
    });

    it('should start momentum scrolling after touch end', () => {
      touchManager = new TouchGestureManager(mockContainer, {
        momentumEnabled: true,
        momentumThreshold: 0.5
      });
      
      // Get event handlers
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      const touchMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )[1];
      const touchEndHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchend'
      )[1];
      
      // Start touch
      touchStartHandler(createMockTouchEvent(100, 1000));
      
      // Move with sufficient velocity - create proper touch event
      global.Date.now = jest.fn(() => 1050);
      const touchMoveEvent = {
        touches: [{ clientY: 150 }],
        preventDefault: jest.fn(),
      };
      touchMoveHandler(touchMoveEvent);
      
      // End touch - this should trigger momentum if velocity is sufficient
      touchEndHandler({ touches: [] });
      
      // Check if momentum was started (requestAnimationFrame should be called)
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle swipe gestures', () => {
      touchManager = new TouchGestureManager(mockContainer, {
        swipeThreshold: 30,
        swipeVelocityThreshold: 0.3
      });
      
      // Start touch
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      touchStartHandler(createMockTouchEvent(100, 1000));
      
      // End touch with sufficient distance and velocity
      global.Date.now = jest.fn(() => 1100); // 100ms later
      const touchEndHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchend'
      )[1];
      
      // Set final touch state to simulate swipe
      const touchMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )[1];
      touchMoveHandler(createMockTouchEvent(140, 1100)); // 40px in 100ms = 0.4 px/ms
      
      touchEndHandler({ touches: [] });
      
      // Should trigger momentum due to swipe
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should clean up event listeners on destroy', () => {
      touchManager = new TouchGestureManager(mockContainer);
      
      touchManager.destroy();
      
      expect(mockContainer.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(mockContainer.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(mockContainer.removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(mockContainer.removeEventListener).toHaveBeenCalledWith('touchcancel', expect.any(Function));
    });

    it('should update configuration', () => {
      touchManager = new TouchGestureManager(mockContainer, {
        touchSensitivity: 1.0
      });
      
      touchManager.updateConfig({
        touchSensitivity: 2.0,
        momentumEnabled: false
      });
      
      // Configuration should be updated (we can't directly test private config,
      // but we can test that the method doesn't throw)
      expect(() => touchManager.updateConfig({})).not.toThrow();
    });
  });

  describe('isTouchDevice', () => {
    it('should detect touch support', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        writable: true
      });
      
      expect(isTouchDevice()).toBe(true);
    });

    it('should detect no touch support', () => {
      // Remove touch support
      delete (window as any).ontouchstart;
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        writable: true
      });
      
      expect(isTouchDevice()).toBe(false);
    });
  });

  describe('getOptimalTouchConfig', () => {
    it('should return iOS-specific configuration', () => {
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true
      });
      
      const config = getOptimalTouchConfig();
      
      expect(config.momentumDecay).toBe(0.92);
      expect(config.bounceEnabled).toBe(true);
      expect(config.touchActionNone).toBe(false);
    });

    it('should return Android-specific configuration', () => {
      // Mock Android user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
        writable: true
      });
      
      const config = getOptimalTouchConfig();
      
      expect(config.momentumDecay).toBe(0.95);
      expect(config.touchSensitivity).toBe(1.1);
    });

    it('should return Safari-specific configuration', () => {
      // Mock Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
        writable: true
      });
      
      const config = getOptimalTouchConfig();
      
      expect(config.passiveListeners).toBe(false);
    });

    it('should return empty config for unknown browsers', () => {
      // Mock generic user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Unknown)',
        writable: true
      });
      
      const config = getOptimalTouchConfig();
      
      expect(Object.keys(config)).toHaveLength(0);
    });
  });

  describe('Touch gesture integration', () => {
    it('should handle rapid touch events without errors', () => {
      touchManager = new TouchGestureManager(mockContainer);
      
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      const touchMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchmove'
      )[1];
      const touchEndHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchend'
      )[1];
      
      // Simulate rapid touch events
      expect(() => {
        touchStartHandler(createMockTouchEvent(100, 1000));
        touchMoveHandler(createMockTouchEvent(110, 1010));
        touchMoveHandler(createMockTouchEvent(120, 1020));
        touchMoveHandler(createMockTouchEvent(130, 1030));
        touchEndHandler({ touches: [] });
      }).not.toThrow();
    });

    it('should handle touch cancel events', () => {
      touchManager = new TouchGestureManager(mockContainer);
      
      const touchStartHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchstart'
      )[1];
      const touchCancelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'touchcancel'
      )[1];
      
      // Start touch
      touchStartHandler(createMockTouchEvent(100));
      expect(touchManager.getTouchState().isActive).toBe(true);
      
      // Cancel touch
      touchCancelHandler({ touches: [] });
      expect(touchManager.getTouchState().isActive).toBe(false);
    });

    it('should handle boundary conditions for scroll position', () => {
      touchManager = new TouchGestureManager(mockContainer, {
        bounceEnabled: true,
        bounceDistance: 50
      });
      
      // Test scrolling beyond top boundary
      mockContainer.scrollTop = -10; // Beyond top
      mockContainer.scrollHeight = 1000;
      mockContainer.clientHeight = 400;
      
      // This should not throw an error
      expect(() => {
        const touchStartHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'touchstart'
        )[1];
        touchStartHandler(createMockTouchEvent(100));
      }).not.toThrow();
    });
  });
});