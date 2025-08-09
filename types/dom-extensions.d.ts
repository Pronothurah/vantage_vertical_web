// DOM extensions for better TypeScript support

declare global {
  // Enhanced style snapshot interface for visual regression tests
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

  // Enhanced event listener function types
  type EventListenerFunction = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;

  type EventRemoverFunction = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => void;

  // Mock function types for testing
  interface MockFunction<T extends (...args: any[]) => any> extends jest.MockedFunction<T> {
    mockImplementation(fn?: T): this;
    mockReturnValue(value: ReturnType<T>): this;
    mockResolvedValue(value: Awaited<ReturnType<T>>): this;
    mockRejectedValue(value: any): this;
  }
}

export {};