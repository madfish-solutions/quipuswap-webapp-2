/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EMPTY_STRING, ZERO_LENGTH } from '@config/constants';

export const isEmptyString = (str: string) => str.length === ZERO_LENGTH || str === EMPTY_STRING;
export const getLastChar = (str: string) => str[str.length - 1];

export const isString = <T>(str: string | T): str is string => typeof str === 'string';
