import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const elements = ['a', 'b', 'c'];
    const result = generateLinkedList(elements);

    expect(result).toStrictEqual({
      value: 'a',
      next: {
        value: 'b',
        next: {
          value: 'c',
          next: {
            value: null,
            next: null,
          },
        },
      },
    });

    const emptyResult = generateLinkedList([]);
    expect(emptyResult).toStrictEqual({
      value: null,
      next: null,
    });
  });

  test('should generate linked list from values 2', () => {
    const elements = [1, 2, 3, 4];
    const result = generateLinkedList(elements);

    expect(result).toMatchSnapshot();

    const mixedElements = [42, 'hello', true, null];
    const mixedResult = generateLinkedList(mixedElements);

    expect(mixedResult).toMatchSnapshot();
  });

  test('should handle edge cases correctly', () => {
    const singleElement = generateLinkedList([999]);
    expect(singleElement).toStrictEqual({
      value: 999,
      next: {
        value: null,
        next: null,
      },
    });

    const withUndefined = generateLinkedList([1, undefined, 3]);
    expect(withUndefined).toMatchSnapshot();
  });
});
