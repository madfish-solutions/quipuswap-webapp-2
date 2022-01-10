import { i18n } from 'next-i18next';

import { Undefined } from '@utils/types';

const RE = /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/;
export const INVALID_INPUT = 'Invalid input';

export const validateUserInput = (input: string): Undefined<string> => {
  const isInputValid = RE.test(input);

  if (!isInputValid) {
    return i18n?.t('common|Invalid input') || INVALID_INPUT;
  }

  return undefined;
};
