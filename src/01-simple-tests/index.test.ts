import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 4, b: 7, action: Action.Add });
    expect(result).toBe(11);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 7, b: 4, action: Action.Subtract });
    expect(result).toBe(3);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 4, b: 7, action: Action.Multiply });
    expect(result).toBe(28);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 8, b: 2, action: Action.Divide });
    expect(result).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 2,
      b: 2,
      action: Action.Exponentiate,
    });
    expect(result).toBe(4);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 4, b: 7, action: 'NotAction' });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({
      a: 'notNumber',
      b: 7,
      action: Action.Multiply,
    });
    expect(result).toBeNull();
  });
});
