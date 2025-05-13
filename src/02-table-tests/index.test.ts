import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 10, b: 5, action: Action.Subtract, expected: 5 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },
  { a: 12, b: 3, action: Action.Divide, expected: 4 },
  { a: 3, b: 4, action: Action.Multiply, expected: 12 },
  { a: 6, b: 5, action: Action.Multiply, expected: 30 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
];

describe('simpleCalculator', () => {
  it.each(testCases)(
    'calculates $a $action $b = $expected',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );

  test('returns null for invalid input', () => {
    expect(
      simpleCalculator({ a: 'notNumber', b: 2, action: Action.Add }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: 1, b: 'notNumber', action: Action.Add }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: 1, b: 2, action: 'invalidAction' }),
    ).toBeNull();
  });
});
