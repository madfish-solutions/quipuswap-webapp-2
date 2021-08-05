export const parseDecimals = (value: string, min: number, max: number) => {
  // leave only numbers
  const onlyNums = value;
  const decimal = /^[-+]?[0-9]+(\.)?[0-9]*$/;
  const isMatchFloat = value.match(decimal);
  if (!isMatchFloat) return '';

  // if no numbers return empty
  if (onlyNums === '') return '';
  // if less then min return min
  if (+onlyNums < min) {
    return min.toString();
  }
  // if greater then max return max
  if (+onlyNums > max) {
    return max.toString();
  }

  // else return number
  return onlyNums;
};
