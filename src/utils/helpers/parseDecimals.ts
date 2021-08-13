const trimString = (input:string, limit:number) => {
  const dot = input.indexOf('.');
  if (dot < 0) return input;
  return input.slice(0, dot) + input.slice(dot, limit);
};

export const parseDecimals = (value: string, min: number, max: number, limit?:number) => {
  // leave only numbers
  const onlyNums = value;
  const decimal = /^[-+]?[0-9]+(\.)?[0-9]*$/;
  const isMatchFloat = value.match(decimal);
  if (!isMatchFloat) return '';

  // if no numbers return empty
  if (onlyNums === '') return '';
  // if less then min return min
  let res = onlyNums;
  if (+onlyNums < min) {
    res = min.toString();
  }
  // if greater then max return max
  if (+onlyNums > max) {
    res = max.toString();
  }
  if (limit) res = trimString(res, limit);
  return res;
};
