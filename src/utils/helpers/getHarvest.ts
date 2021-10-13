import { fromOpOpts } from '@quipuswap/sdk';

import { SubmitType } from '@utils/types';

export const getHarvest = async ({
  accountPkh,
  farmContract,
  handleErrorToast,
  farmId,
}: SubmitType) => {
  try {
    const farmParams = [
      farmContract.methods
        .harvest(farmId, accountPkh)
        .toTransferParams(fromOpOpts(undefined, undefined))];
    return farmParams;
  } catch (e) {
    handleErrorToast(e);
    return [];
  }
};
