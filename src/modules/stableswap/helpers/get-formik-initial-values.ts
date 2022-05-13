import { getInputSlugByIndex } from './get-input-slug-by-index';

const FORMIK_INITIAL_VALUE = '';

export const getFormikInitialValues = (length: number) => {
  const inputsIds: Array<Array<string>> = Array(length)
    .fill(FORMIK_INITIAL_VALUE)
    .map((item, index) => [getInputSlugByIndex(index), item]);

  return Object.fromEntries(inputsIds);
};
