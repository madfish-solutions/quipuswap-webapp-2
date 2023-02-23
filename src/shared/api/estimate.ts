import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { parseTransferParamsToParamsWithKind } from 'swap-router-sdk';

import { ZERO_AMOUNT_BN } from '@config/constants';

export const estimateFee = async (tezos: TezosToolkit, accountPkh: string, transferParams: TransferParams[]) => {
  const estimations = await tezos.estimate.batch(
    transferParams.map(params => ({
      ...parseTransferParamsToParamsWithKind(params),
      source: accountPkh
    }))
  );

  return estimations.reduce<BigNumber>(
    (
      acc,
      {
        storageLimit,
        suggestedFeeMutez,
        // @ts-ignore
        minimalFeePerStorageByteMutez
      }
    ) => acc.plus(suggestedFeeMutez).plus(storageLimit * minimalFeePerStorageByteMutez),
    ZERO_AMOUNT_BN
  );
};
