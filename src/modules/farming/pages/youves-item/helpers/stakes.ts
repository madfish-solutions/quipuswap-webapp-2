import BigNumber from 'bignumber.js';

import { OPPOSITE_INDEX } from '@config/constants';

import { YouvesStakeModel } from '../../../models';

const NEW_STAKE = 0;
const FALLBACK_STAKE_ID = new BigNumber(NEW_STAKE);

export const getLastOrNewStakeId = (stakes: YouvesStakeModel[]) =>
  stakes.length ? stakes[stakes.length - OPPOSITE_INDEX].id : FALLBACK_STAKE_ID;
