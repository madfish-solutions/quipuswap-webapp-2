import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { BigMap } from '@shared/types';

interface StorageTezToken {
  storage: { ledger: BigMap<string, { balance: BigNumber }> };
}

export const getUserLpBalanceTezToken = async (
  contractInstance: ContractAbstraction<ContractProvider>,
  accountPkh: string
): Promise<Nullable<BigNumber>> => {
  const storage = await contractInstance.storage<StorageTezToken>();
  const balance = await storage.storage.ledger.get(accountPkh);

  return balance?.balance ?? null;
};
