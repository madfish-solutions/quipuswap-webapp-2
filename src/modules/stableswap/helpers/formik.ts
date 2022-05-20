import { getInputSlugByIndex } from './get-input-slug-by-index';

const EMPTY_STRING = '';

const createFormikValues = (values: Array<string>) => {
  const mapLikeFormikValues = values.map((value, index) => [getInputSlugByIndex(index), value]);

  return Object.fromEntries(mapLikeFormikValues);
};

export const getFormikInitialValues = (length: number) => {
  const filledArrayByEmptyStrings = new Array(length).fill(EMPTY_STRING);

  return createFormikValues(filledArrayByEmptyStrings);
};
