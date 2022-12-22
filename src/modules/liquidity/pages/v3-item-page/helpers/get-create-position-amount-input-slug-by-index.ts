import { CreatePositionAmountInput } from '../types/create-position-form';

export const getCreatePositionAmountInputSlugByIndex = (index: number) =>
  `create-position-input-${index}` as CreatePositionAmountInput;
