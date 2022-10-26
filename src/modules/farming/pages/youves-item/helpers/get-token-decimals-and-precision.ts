import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { getTokenMetadata } from '@shared/api';
import { isExist } from '@shared/helpers';

export const getTokenDecimalsAndPrecision = async (tokenAddress: string, tokenId?: BigNumber.Value) => {
  const depositTokenMetadata = await getTokenMetadata({
    contractAddress: tokenAddress,
    fa2TokenId: isExist(tokenId) ? Number(tokenId) : undefined
  });
  const tokenDecimals = depositTokenMetadata?.decimals ?? ZERO_AMOUNT;
  const tokenPrecision = Number(`1e${tokenDecimals}`);

  return { tokenDecimals, tokenPrecision };
};
