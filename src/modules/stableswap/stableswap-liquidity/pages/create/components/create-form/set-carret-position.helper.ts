import { PERCENT } from '@config/constants';
import { isEqual, isNull } from '@shared/helpers';

const CARRET_POSITION_SHIFT = 1;

export const setCarretPosition = (input: Nullable<HTMLInputElement>) => {
  if (isNull(input)) {
    return;
  }

  const selectionStart = input.selectionStart;

  if (!input.value.includes(PERCENT)) {
    input.value = `${input.value}${PERCENT}`;
  }

  if (isEqual(selectionStart, input.value.length - CARRET_POSITION_SHIFT)) {
    input.setSelectionRange(selectionStart, selectionStart);
  }
};
