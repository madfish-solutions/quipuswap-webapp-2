import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { fromDecimals } from '@utils/helpers';
import { Nullable, VoterType } from '@utils/types';

const EMPTY_BALANCE = 0;
const EMPTY_BALANCE_BN = new BigNumber(EMPTY_BALANCE);

export const getVoter = async (accountPkh: Nullable<string>, dex: Nullable<FoundDex>): Promise<Nullable<VoterType>> => {
  if (!accountPkh || !dex) {
    return null;
  }
  const voter = await dex.storage.storage.voters.get(accountPkh);

  if (voter) {
    return {
      veto: fromDecimals(voter.veto, LP_TOKEN_DECIMALS),
      candidate: voter.candidate,
      vote: fromDecimals(voter.vote, LP_TOKEN_DECIMALS)
    };
  }

  return {
    veto: EMPTY_BALANCE_BN,
    candidate: null,
    vote: EMPTY_BALANCE_BN
  };
};
