import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { BigMap, LedgerKey, Nullable } from '@shared/types';

interface StorageDexTwo {
  storage: { ledger: BigMap<LedgerKey, BigNumber> };
}

export const getUserLpBalanceDexTwo = async (
  contractInstance: ContractAbstraction<ContractProvider>,
  accountPkh: string,
  tokenId: BigNumber
): Promise<Nullable<BigNumber>> => {
  const storage = await contractInstance.storage<StorageDexTwo>();

  return (await storage.storage.ledger.get([accountPkh, tokenId])) ?? null;
};
