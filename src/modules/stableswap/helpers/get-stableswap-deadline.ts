import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { SECONDS_IN_MINUTE } from '@config/constants';
import { getBlockchainTimestamp } from '@shared/helpers';

export const getStableswapDeadline = async (tezos: TezosToolkit, transactionDuration: BigNumber) => {
  const blockchainDeadlineTimestamp = await getBlockchainTimestamp(
    tezos,
    transactionDuration.multipliedBy(SECONDS_IN_MINUTE).toNumber()
  );

  return blockchainDeadlineTimestamp.toString();
};
