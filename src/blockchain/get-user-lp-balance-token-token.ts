import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { BigMap, LedgerKey } from '@shared/types';

interface StorageTokenToken {
  storage: { ledger: BigMap<LedgerKey, { balance: BigNumber }> };
}

export const getUserLpBalanceTokenToken = async (
  contractInstance: ContractAbstraction<ContractProvider>,
  accountPkh: string,
  tokenId: BigNumber
): Promise<Nullable<BigNumber>> => {
  const storage = await contractInstance.storage<StorageTokenToken>();
  const balance = await storage.storage.ledger.get([accountPkh, tokenId]);

  return balance?.balance ?? null;
};
