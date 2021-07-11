export const prettyPrice = (value: number, dec?: number) => {
  if (value.toString().length > 6) {
    return new Intl.NumberFormat(
      'en',
      {
        maximumFractionDigits: dec ?? 6,
        notation: 'compact',
      },
    ).format(value);
  }

  return new Intl.NumberFormat(
    'en',
  ).format(value);
};
