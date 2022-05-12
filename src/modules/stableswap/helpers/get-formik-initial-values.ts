import { getInputSlugByIndex } from './get-input-slug-by-index';

export const getFormikInitialValues = (length: number) => {
  const inputsIds: Record<string, string> = {};

  let key = '';
  for (let index = 0; index < length; index++) {
    key = getInputSlugByIndex(index);

    inputsIds[key] = '';
  }

  return inputsIds;
};
