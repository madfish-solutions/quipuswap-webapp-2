import { EVERSTAKE_BAKER } from '@config/constants';
import { WhitelistedBaker } from '@shared/types';

export const getEverstakeBaker = (bakers: Array<WhitelistedBaker>) =>
  bakers.find(({ address }) => address === EVERSTAKE_BAKER);
