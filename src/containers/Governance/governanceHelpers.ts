import {
  batchify, fromOpOpts, Token, withTokenApprove,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

type SubmitType = {
  tezos: TezosToolkit,
  fromAsset: Token
  accountPkh: string,
  govContract: any,
  handleErrorToast: (error:any) => void
  handleSuccessToast: () => void
};

export const claimVotes = async ({
  tezos,
  fromAsset,
  accountPkh,
  govContract,
  handleErrorToast,
  handleSuccessToast,
}: SubmitType) => {
  try {
    const govParams = await withTokenApprove(
      tezos,
      fromAsset,
      accountPkh,
      govContract.address,
      0,
      [
        govContract.methods
          .claim([])
          .toTransferParams(fromOpOpts(undefined, undefined)),
      ],
    );
    const op = await batchify(
      tezos.wallet.batch([]),
      govParams,
    ).send();
    await op.confirmation();
    handleSuccessToast();
  } catch (e) {
    handleErrorToast(e);
  }
};
