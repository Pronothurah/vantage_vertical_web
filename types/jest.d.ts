import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: (string | RegExp)[]): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveValue(value: string | number | RegExp): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveStyle(style: string | object): R;
      toBeVisible(): R;
      toBeEmptyDOMElement(): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveAccessibleDescription(text?: string | RegExp): R;
      toHaveAccessibleName(text?: string | RegExp): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveErrorMessage(text?: string | RegExp): R;
    }
  }
}