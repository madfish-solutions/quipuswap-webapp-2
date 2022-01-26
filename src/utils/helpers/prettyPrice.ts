export const prettyPrice = (value: number, dec?: number, length?: number) => {
  if (value.toString().length > (length ?? 6) && value > 100000) {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: dec ?? 6,
      notation: 'compact'
    }).format(value);
  }

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: dec ?? 6
  }).format(value);
};
