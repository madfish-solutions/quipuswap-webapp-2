import { EMPTY_STRING, ZERO_LENGTH } from '@config/constants';

export const isEmptyString = (str: string) => str.length === ZERO_LENGTH || str === EMPTY_STRING;
