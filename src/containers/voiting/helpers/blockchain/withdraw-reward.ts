import { batchify } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';

import { useConfirmOperation } from '@utils/dapp/confirm-operation';

export const submitWithdraw = async (
  tezos: TezosToolkit,
  voteParams: TransferParams[],
  handleErrorToast: (err: Error) => void,
  confirmOperation: ReturnType<typeof useConfirmOperation>
) => {
  try {
    const op = await batchify(tezos.wallet.batch([]), voteParams).send();

    return await confirmOperation(op.opHash);
  } catch (e) {
    handleErrorToast(e as Error);

    return Promise.reject(e);
  }
};
