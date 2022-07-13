import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { STABLESWAP_FACTORY_CONTRACT_ADDRESS } from '@config/enviroment';
import { DEFAULT_TOKEN } from '@config/tokens';
import { getStorageInfo } from '@shared/dapp';
import { fromDecimals } from '@shared/helpers';

interface Storage {
  storage: {
    init_price: BigNumber;
  };
}

export const getPoolCreationCostApi = async (tezos: TezosToolkit) => {
  const stableswapFactoryContractStorage = await getStorageInfo<Storage>(tezos, STABLESWAP_FACTORY_CONTRACT_ADDRESS);

  return fromDecimals(stableswapFactoryContractStorage.storage.init_price, DEFAULT_TOKEN);
};
