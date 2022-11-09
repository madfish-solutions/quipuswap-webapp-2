import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { DexTypeEnum } from 'swap-router-sdk';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { getDexTwoDevFee } from '@shared/helpers/amplitude/get-dex-two-dev-fee';
import { getStableswapContractFee } from '@shared/helpers/amplitude/get-stableswap-contract-fee';
import { getStableswapDevFee } from '@shared/helpers/amplitude/get-stableswap-dev-fee';

const DEX_ONE_FEE = new BigNumber(0.3);
const DEX_TWO_FEE = new BigNumber(0.35);

const fees = {
  dexOne: DEX_ONE_FEE,
  dexTwo: DEX_TWO_FEE
};

export const mapRouteFee = async (tezos: TezosToolkit, dexType: DexTypeEnum, stableswapContracAddress: string) => {
  switch (dexType) {
    case DexTypeEnum.QuipuSwap:
    case DexTypeEnum.QuipuSwapTokenToTokenDex:
      return fees.dexOne;
    case DexTypeEnum.QuipuSwap20:
      return [fees.dexTwo, await getDexTwoDevFee(tezos)];
    case DexTypeEnum.QuipuSwapCurveLike:
      return [await getStableswapContractFee(tezos, stableswapContracAddress), await getStableswapDevFee(tezos)];
    default:
      return ZERO_AMOUNT_BN;
  }
};
