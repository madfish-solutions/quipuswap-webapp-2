import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Undefined } from '@utils/types';

const ONE_THOUSAND = 1000;
const HALF_AN_HOUR_IN_SECONDS = 1800;
const SECONDS_IN_ONE_MIN = 60;

export const getDeadline = async (tezos: TezosToolkit, transactionDuration: Undefined<BigNumber>): Promise<string> => {
  const currentTime = (await tezos.rpc.getBlockHeader()).timestamp;
  const currentTimeMilliseconds = new Date(currentTime).getTime();
  const currentTimeSeconds = currentTimeMilliseconds / ONE_THOUSAND;

  if (transactionDuration) {
    const transactionDurationInSeconds = transactionDuration.multipliedBy(SECONDS_IN_ONE_MIN);

    return transactionDurationInSeconds.plus(currentTimeSeconds).toFixed();
  }

  return (currentTimeSeconds + HALF_AN_HOUR_IN_SECONDS).toFixed();
};
