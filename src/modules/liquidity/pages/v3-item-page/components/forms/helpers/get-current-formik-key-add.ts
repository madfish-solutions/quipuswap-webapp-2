import { FIRST_INDEX } from '@config/constants';
import { isEqual } from '@shared/helpers';

import { V3AddTokenInput } from '../interface';

export const getCurrentFormikKeyAdd = (currentIndex: number, indexToCompare = FIRST_INDEX) =>
  isEqual(currentIndex, indexToCompare) ? V3AddTokenInput.firstTokenInput : V3AddTokenInput.secondTokenInput;
