import { EMPTY_STRING, PERCENT } from '@config/constants';

export const removePercentFromInputValue = (inputValue: string) => inputValue.replace(PERCENT, EMPTY_STRING);
