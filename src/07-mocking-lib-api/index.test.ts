import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((func) => func),
}));

let mockedGet: jest.Mock;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    mockedGet = jest.fn((relativePath) =>
      Promise.resolve({
        data: `Received from ${relativePath}`,
      }),
    );

    jest
      .spyOn(axios, 'create')
      .mockReturnValue({ get: mockedGet } as unknown as AxiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    expect(axios.create).not.toHaveBeenCalled();
    await throttledGetDataFromApi('');
    expect(axios.create).toHaveBeenCalled();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    expect(mockedGet).not.toHaveBeenCalled();
    expect(axios.create).not.toHaveBeenCalled();

    await throttledGetDataFromApi('testPath');

    expect(axios.create).toHaveBeenCalled();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(mockedGet).toHaveBeenCalled();
    expect(mockedGet).toHaveBeenCalledWith('testPath');
  });

  test('should return response data', async () => {
    expect(mockedGet).not.toHaveBeenCalled();
    expect(axios.create).not.toHaveBeenCalled();

    const result = await throttledGetDataFromApi('testPath');

    expect(axios.create).toHaveBeenCalled();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(mockedGet).toHaveBeenCalled();
    expect(mockedGet).toHaveBeenCalledWith('testPath');
    expect(result).toEqual('Received from testPath');
  });
});
