import BigNumber from 'bignumber.js';

import { NEW_FARMINGS } from '@config/config';

export const isNewFarming = (id: BigNumber) => NEW_FARMINGS.includes(id.toFixed());
