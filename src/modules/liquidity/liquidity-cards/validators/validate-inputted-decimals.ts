import { i18n } from '@translation';

const DECIMAL = '.';
const FRACTION_PART_INDEX = 1;
const INPUTTED_DECIMALS_ERROR = 'Fractional part is too large';

export const validateInputtedDecimals = (userInput: string, decimals: number, tokenSymbol: string) => {
  if (userInput.includes(DECIMAL)) {
    const fraction = userInput.split(DECIMAL)[FRACTION_PART_INDEX];

    if (fraction.length > decimals) {
      return (
        i18n?.t('common|tokenDecimalsOverflowError', {
          tokenSymbol: tokenSymbol,
          decimalPlaces: decimals
        }) || INPUTTED_DECIMALS_ERROR
      );
    }
  }

  return undefined;
};
