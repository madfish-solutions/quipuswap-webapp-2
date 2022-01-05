import { appi18n } from '@app.i18n';
import { Undefined } from '@utils/types';

const allowedSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

export const validateUserInput = (input: string): Undefined<string> => {
  for (const symbol of input) {
    if (!allowedSymbols.includes(symbol)) {
      return appi18n.t('common|Letters are not allowed') || 'Letters are not allowed';
    }
  }

  return undefined;
};
