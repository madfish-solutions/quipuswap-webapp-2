import { withTokenApprove, fromOpOpts } from '@quipuswap/sdk';

import { SubmitType } from '@utils/types';

export const getHarvest = async ({
  tezos,
  fromAsset,
  accountPkh,
  farmContract,
  handleErrorToast,
  farmId,
}: SubmitType) => {
  try {
    const farmParams = await withTokenApprove(
      tezos,
      fromAsset,
      accountPkh,
      farmContract.address,
      0,
      [
        farmContract.methods
          .harvest(farmId, accountPkh)
          .toTransferParams(fromOpOpts(undefined, undefined)),
      ],
    );
    return farmParams;
  } catch (e) {
    handleErrorToast(e);
    return [];
  }
};
