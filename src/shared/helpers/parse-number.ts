export const parseNumber = (value: string, min: number, max: number) => {
  // leave only numbers
  const onlyNums = value.replace(/[^0-9]/g, '');

  // if no numbers return empty
  if (onlyNums === '') {
    return '';
  }
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
