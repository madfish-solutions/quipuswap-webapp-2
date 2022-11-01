import { ContractAbstraction, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

interface ITezTokenStorage {
  storage: {
    tez_pool: BigNumber;
    token_pool: BigNumber;
    total_supply: BigNumber;
  };
}

export const fetchTezTokenPoolReserves = async (contractInstance: ContractAbstraction<Wallet>) => {
  const accordanceStorageTez = await contractInstance.storage<ITezTokenStorage>();

  return {
    aTokenAtomicTvl: accordanceStorageTez.storage.token_pool,
    bTokenAtomicTvl: accordanceStorageTez.storage.tez_pool,
    totalLpSupply: accordanceStorageTez.storage.total_supply
  };
};
