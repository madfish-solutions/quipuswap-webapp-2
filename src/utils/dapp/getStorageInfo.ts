import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';

const getContractPure = (tezos: TezosToolkit, address: string) => tezos.contract.at(address);

export const getContract = memoizee(getContractPure, { promise: true });

const getStoragePure = async (tezos: TezosToolkit, contractAddress: string) => {
  const contract = await getContract(tezos, contractAddress);

  return contract?.storage();
};

export const getStorageInfo = memoizee(getStoragePure, { promise: true, maxAge: 30000 });
