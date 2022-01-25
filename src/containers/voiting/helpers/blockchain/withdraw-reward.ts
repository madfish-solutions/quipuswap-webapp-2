import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';

import { useConfirmOperation } from '@utils/dapp/confirm-operation';

export const submitWithdraw = async (
  tezos: TezosToolkit,
  voteParams: TransferParams[],
  confirmOperation: ReturnType<typeof useConfirmOperation>
) => {
  const op = await batchify(tezos.wallet.batch([]), voteParams).send();

  return await confirmOperation(op.opHash);
};
