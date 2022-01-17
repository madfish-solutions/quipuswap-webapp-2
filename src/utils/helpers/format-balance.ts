const DEFAULT_BALANCE_LENGTH = 7;

const formatDecimal = (decimals: string): string => {
  if (decimals[decimals.length - 1] === '0') {
    const decimals_ = decimals.slice(0, decimals.length - 1);

    return formatDecimal(decimals_);
  }

  return decimals;
};

export const formatBalance = (value: number | string): string => {
  const [integer, decimals] = typeof value === 'number' ? value.toString().split('.') : value.split('.');

  if (integer === '0') {
    return value.toString();
  } else if (integer.length < DEFAULT_BALANCE_LENGTH) {
    const decimals_ = decimals.slice(0, DEFAULT_BALANCE_LENGTH - integer.length);
    const formatedDecimal = formatDecimal(decimals_);

    return formatedDecimal ? `${integer}.${formatedDecimal}` : integer;
  } else {
    return integer;
  }
};
