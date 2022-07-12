export const onlyDigitsAndSeparator = (amount: string) =>
  amount
    .split('')
    .filter(symbol => isNaN(Number(symbol)) === false || symbol === '.')
    .join('');
