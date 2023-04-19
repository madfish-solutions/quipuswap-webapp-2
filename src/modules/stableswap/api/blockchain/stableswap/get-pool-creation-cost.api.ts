import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { STABLESWAP_FACTORY_CONTRACT_ADDRESS, STABLESWAP_V2_FACTORY_ADDRESS } from '@config/environment';
import { QUIPU_TOKEN } from '@config/tokens';
import { getStorageInfo } from '@shared/dapp';
import { toReal } from '@shared/helpers';

import { StableswapVersion } from '../../../types';

interface Storage {
  storage: {
    init_price: BigNumber;
  };
}

export const getRealPoolCreationCostApi = async (tezos: TezosToolkit, poolVersion: StableswapVersion) => {
  const stableswapFactoryContractStorage = await getStorageInfo<Storage>(
    tezos,
    poolVersion === StableswapVersion.V1 ? STABLESWAP_FACTORY_CONTRACT_ADDRESS : STABLESWAP_V2_FACTORY_ADDRESS!
  );

  return toReal(stableswapFactoryContractStorage.storage.init_price, QUIPU_TOKEN);
};
