// Test utility types for better TypeScript support in test files

declare global {
  // Enhanced HTMLElement interface for test scenarios
  interface HTMLElement {
    overflowY?: string;
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject | ((...args: any[]) => void),
      options?: boolean | AddEventListenerOptions
    ) => void;
    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject | ((...args: any[]) => void),
      options?: boolean | EventListenerOptions
    ) => void;
  }

  // Test persona types for user acceptance testing
  interface TestPersona {
    name: string;
    device: {
      width: number;
      height: number;
    };
    expectations: string[];
    preferences?: {
      reducedMotion?: boolean;
      highContrast?: boolean;
    };
    assistiveTech?: string;
  }

  // Enhanced CSSStyleDeclaration for test snapshots
  interface CSSStyleDeclaration {
    overflowY: string;
  }

  // Mock event listener types with flexible parameters
  type MockEventListenerFunction = (
    type: string,
    listener: EventListenerOrEventListenerObject | ((...args: any[]) => void),
    options?: boolean | AddEventListenerOptions
  ) => void;

  type MockEventRemoverFunction = (
    type: string,
    listener: EventListenerOrEventListenerObject | ((...args: any[]) => void),
    options?: boolean | EventListenerOptions
  ) => void;

  // Enhanced Element interface for test scenarios
  interface Element {
    addEventListener: MockEventListenerFunction;
    removeEventListener: MockEventRemoverFunction;
  }

  // Style snapshot interface for visual regression tests
  interface StyleSnapshot {
    styles: {
      backgroundColor: string;
      color: string;
      fontSize: string;
      fontFamily: string;
      padding: string;
      margin: string;
      borderRadius: string;
      boxShadow: string;
      opacity: string;
      transform: string;
      transition: string;
      overflowY: string;
      [key: string]: string;
    };
  }
}

// Export empty object to make this a module
export {};