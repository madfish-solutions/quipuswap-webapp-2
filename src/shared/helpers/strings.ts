const EMPTY_STRING = '';
const ZERO_LENGTH = 0;

export const isEmptyString = (str: string) => str.length === ZERO_LENGTH || str === EMPTY_STRING;
