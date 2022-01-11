import { i18n } from 'next-i18next';

const DECIMAL = '.';
const FRACTION_PART_INDEX = 1;
const INPUTTED_DECIMALS_ERROR = 'Inputted decimals should be not greater than token decimals';

export const validateInputtedDecimals = (userInput: string, decimals: number) => {
  if (userInput.includes(DECIMAL)) {
    const fraction = userInput.split(DECIMAL)[FRACTION_PART_INDEX];

    if (fraction.length > decimals) {
      return i18n?.t(`common|${INPUTTED_DECIMALS_ERROR}`) || INPUTTED_DECIMALS_ERROR;
    }
  }

  return undefined;
};
