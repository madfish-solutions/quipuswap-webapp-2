const DIGIT_SEPARATOR = '.';

export const onlyDigitsAndSeparator = (amount: string) =>
  amount
    .split('')
    .filter(symbol => isNaN(Number(symbol)) === false || symbol === DIGIT_SEPARATOR)
    .join('');
