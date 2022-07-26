import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { STABLESWAP_FACTORY_CONTRACT_ADDRESS } from '@config/enviroment';
import { QUIPU_TOKEN } from '@config/tokens';
import { getStorageInfo } from '@shared/dapp';
import { toReal } from '@shared/helpers';

interface Storage {
  storage: {
    init_price: BigNumber;
  };
}

export const getPoolCreationCostApi = async (tezos: TezosToolkit) => {
  const stableswapFactoryContractStorage = await getStorageInfo<Storage>(tezos, STABLESWAP_FACTORY_CONTRACT_ADDRESS);

  return toReal(stableswapFactoryContractStorage.storage.init_price, QUIPU_TOKEN);
};
