// Test mock types for better TypeScript support in test files

declare global {
  // Event listener function types with flexible parameters
  type FlexibleEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject | ((...args: any[]) => any),
    options?: boolean | AddEventListenerOptions
  ) => void;

  type FlexibleEventRemover = (
    type: string,
    listener: EventListenerOrEventListenerObject | ((...args: any[]) => any),
    options?: boolean | EventListenerOptions
  ) => void;

  // Mock event listener with rest parameters - using tuple with spread
  type RestEventListener = (...args: any[]) => void;
  type RestEventRemover = (...args: any[]) => void;

  // Enhanced HTMLElement for test mocking
  interface HTMLElement {
    addEventListener: FlexibleEventListener & RestEventListener;
    removeEventListener: FlexibleEventRemover & RestEventRemover;
  }

  // Enhanced Element for test mocking
  interface Element {
    addEventListener: FlexibleEventListener & RestEventListener;
    removeEventListener: FlexibleEventRemover & RestEventRemover;
  }

  // Test persona union type with all possible properties
  type TestPersonaUnion = {
    name: string;
    device: { width: number; height: number };
    expectations: string[];
    preferences?: { reducedMotion?: boolean; highContrast?: boolean };
    assistiveTech?: string;
  };

  // Style snapshot with all possible CSS properties
  interface TestStyleSnapshot {
    styles: CSSStyleDeclaration & {
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

  // Visual regression test types
  interface VisualSnapshot {
    dimensions: {
      width: number;
      height: number;
    };
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

  // Array types for test scenarios
  type TestDifferences = string[];
  type TestIssues = string[];
  type PerformancePromises = Promise<any>[];
}

export {};