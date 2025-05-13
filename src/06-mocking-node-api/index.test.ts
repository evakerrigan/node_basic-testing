import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');

    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');

    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (join as jest.Mock).mockImplementation((dir, file) => `${dir}/${file}`);
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'test-file.txt';

    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'non-existent-file.txt';
    const fullPath = '/mocked/path/non-existent-file.txt';

    (join as jest.Mock).mockReturnValue(fullPath);
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(existsSync).toHaveBeenCalledWith(fullPath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing-file.txt';
    const fullPath = '/mocked/path/existing-file.txt';
    const fileContent = Buffer.from('file content');

    (join as jest.Mock).mockReturnValue(fullPath);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(fileContent);

    const result = await readFileAsynchronously(pathToFile);

    expect(existsSync).toHaveBeenCalledWith(fullPath);
    expect(readFile).toHaveBeenCalledWith(fullPath);
    expect(result).toBe('file content');
  });
});
