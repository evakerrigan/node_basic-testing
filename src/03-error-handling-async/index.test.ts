import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const testValue = 'test value';
    const result = await resolveValue(testValue);
    expect(result).toBe(testValue);
  });

  test('should resolve with different data types', async () => {
    expect(await resolveValue(74)).toBe(74);
    expect(await resolveValue(true)).toBe(true);
    expect(await resolveValue(null)).toBe(null);

    const obj = { key: 'value' };
    expect(await resolveValue(obj)).toBe(obj);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'Test error message';
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });

  test('should create an instance of MyAwesomeError', () => {
    try {
      throwCustomError();
    } catch (error: unknown) {
      if (error instanceof MyAwesomeError) {
        expect(error).toBeInstanceOf(MyAwesomeError);
        expect(error.message).toBe('This is my awesome custom error!');
      } else {
        fail('Expected error to be instance of MyAwesomeError');
      }
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });

  test('should reject with an instance of MyAwesomeError', async () => {
    try {
      await rejectCustomError();
    } catch (error: unknown) {
      if (error instanceof MyAwesomeError) {
        expect(error).toBeInstanceOf(MyAwesomeError);
        expect(error.message).toBe('This is my awesome custom error!');
      } else {
        fail('Expected error to be instance of MyAwesomeError');
      }
    }
  });
});
