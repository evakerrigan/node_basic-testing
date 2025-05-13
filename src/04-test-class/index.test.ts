import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);

    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 50;
    const account = getBankAccount(initialBalance);

    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      `Insufficient funds: cannot withdraw more than ${initialBalance}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const sourceAccount = getBankAccount(50);
    const targetAccount = getBankAccount(0);

    expect(() => sourceAccount.transfer(100, targetAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(sourceAccount.getBalance()).toBe(50);
    expect(targetAccount.getBalance()).toBe(0);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);

    account.deposit(50);
    expect(account.getBalance()).toBe(150);

    account.deposit(25).deposit(25);
    expect(account.getBalance()).toBe(200);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);

    account.withdraw(30);
    expect(account.getBalance()).toBe(70);

    account.withdraw(20).withdraw(10);
    expect(account.getBalance()).toBe(40);
  });

  test('should transfer money', () => {
    const sourceAccount = getBankAccount(100);
    const targetAccount = getBankAccount(50);

    sourceAccount.transfer(30, targetAccount);

    expect(sourceAccount.getBalance()).toBe(70);
    expect(targetAccount.getBalance()).toBe(80);

    sourceAccount.transfer(10, targetAccount).deposit(5);
    expect(sourceAccount.getBalance()).toBe(65);
    expect(targetAccount.getBalance()).toBe(90);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);
    const mockBalanceValue = 75;

    (random as jest.Mock)
      .mockReturnValueOnce(mockBalanceValue)
      .mockReturnValueOnce(1);

    const newBalance = await account.fetchBalance();

    expect(newBalance).toBe(mockBalanceValue);
    expect(account.getBalance()).toBe(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);
    const mockBalanceValue = 75;

    (random as jest.Mock)
      .mockReturnValueOnce(mockBalanceValue)
      .mockReturnValueOnce(1);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(mockBalanceValue);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockImplementation(async () => null);

    try {
      await account.synchronizeBalance();
      fail('Expected synchronizeBalance to throw, but it did not');
    } catch (error: unknown) {
      if (error instanceof SynchronizationFailedError) {
        expect(error).toBeInstanceOf(SynchronizationFailedError);
        expect(error.message).toBe('Synchronization failed');
      } else {
        throw error;
      }
    }

    expect(account.getBalance()).toBe(100);
  });
});
