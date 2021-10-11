import {
  batchify,
  fromOpOpts,
  Token,
  withTokenApprove,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { toDecimals } from '@utils/helpers';

export const submitForm = async (
  tezos:TezosToolkit,
  accountPkh: string,
  updateToast: (err:Error) => void,
  handleSuccessToast: (text:string) => void,
  farmContract: any,
  currentTab: string,
  farmId: BigNumber,
  amount: BigNumber,
  candidate: string,
  fromAsset: Token,
) => {
  try {
    let farmParams: TransferParams[];
    if (currentTab === 'stake') {
      farmParams = await withTokenApprove(
        tezos,
        fromAsset,
        accountPkh,
        farmContract.address,
        0,
        [
          farmContract.methods
            .deposit(farmId, toDecimals(amount, 6), null, accountPkh, candidate)
            .toTransferParams(fromOpOpts(undefined, undefined)),
        ],
      );
    } else {
      farmParams = await withTokenApprove(
        tezos,
        fromAsset,
        accountPkh,
        farmContract.address,
        0,
        [
          farmContract.methods
            .withdraw(farmId, toDecimals(amount, 6), accountPkh, accountPkh)
            .toTransferParams(fromOpOpts(undefined, undefined)),
        ],
      );
    }
    const op = await batchify(
      tezos.wallet.batch([]),
      farmParams,
    ).send();
    await op.confirmation();
    if (currentTab === 'stake') {
      handleSuccessToast('farms|Stake completed!');
    } else {
      handleSuccessToast('farms|Unstake completed!');
    }
  } catch (e) {
    console.error(e);
    updateToast(e as Error);
  }
};
