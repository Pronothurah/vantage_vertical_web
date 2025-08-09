// Application-specific type declarations

declare global {
  // Blog management types - make BlogPost properties more flexible
  interface BlogPost {
    [key: string]: any;
  }

  interface BlogFrontmatter {
    [key: string]: any;
  }

  // Test persona types with all possible properties
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

  // Visual regression test snapshot types
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

  // Enhanced CSSStyleDeclaration for test scenarios
  interface CSSStyleDeclaration {
    overflowY: string;
  }
}

export {};