import BigNumber from 'bignumber.js';

import { formatValueBalance } from './format-balance';

enum DigitsLetters {
  K = 'K',
  M = 'M',
  B = 'B',
  T = 'T',
  Q = 'Q',
  QQ = 'QQ',
  S = 'S'
}

const LETTERS_DIGITS = {
  [DigitsLetters.K]: 1e3,
  [DigitsLetters.M]: 1e6,
  [DigitsLetters.B]: 1e9,
  [DigitsLetters.T]: 1e12,
  [DigitsLetters.Q]: 1e15,
  [DigitsLetters.QQ]: 1e18,
  [DigitsLetters.S]: 1e21
};

const LETTERS = Object.keys(LETTERS_DIGITS);
const DIGITS = Object.values(LETTERS_DIGITS);

const DECIMALS = 1;
const short = (value: number, digit: number, letter: string, amountDecimals?: number) =>
  formatValueBalance((value / digit).toFixed(amountDecimals ?? DECIMALS)) + letter;

export const shortNumberWithLetters = (value: BigNumber.Value, amountDecimals?: number) => {
  const bn = new BigNumber(value);
  const num = bn.toNumber();
  if (num < LETTERS_DIGITS.K) {
    return formatValueBalance(value, amountDecimals);
  }

  for (let index = 0; index <= DIGITS.length; index++) {
    if (num >= DIGITS[index] && num < DIGITS[index + 1]) {
      return short(num, DIGITS[index], LETTERS[index], amountDecimals);
    }
  }

  return short(num, LETTERS_DIGITS.S, DigitsLetters.S, amountDecimals);
};
