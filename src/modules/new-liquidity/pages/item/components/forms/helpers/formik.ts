import { EMPTY_STRING } from '@config/constants';

import { getInputSlugByIndex } from './forms.helpers';

const INPUT_QUANTITY = 3;

export const getFormikInitialValues = () => {
  const formikValues = new Array(INPUT_QUANTITY)
    .fill(EMPTY_STRING)
    .map((value, index) => [getInputSlugByIndex(index), value]);

  return Object.fromEntries(formikValues);
};
