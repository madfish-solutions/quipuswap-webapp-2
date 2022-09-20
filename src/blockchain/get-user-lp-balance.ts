import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN_ID_BN } from '@config/constants';
import { PoolType } from '@modules/new-liquidity/interfaces';
import { BigMap } from '@shared/types';

type LedgerKey = [string, BigNumber];

interface StorageDexTwo {
  storage: { ledger: BigMap<LedgerKey, BigNumber> };
}

interface StorageTokenToken {
  storage: { ledger: BigMap<LedgerKey, { balance: BigNumber }> };
}

interface StorageTezToken {
  storage: { ledger: BigMap<string, { balance: BigNumber }> };
}

export const getUserLpBalance = async (
  tezos: TezosToolkit,
  accountPkh: string,
  contractAddress: string,
  type: PoolType,
  tokenId: BigNumber = DEFAULT_TOKEN_ID_BN
): Promise<Nullable<BigNumber>> => {
  const contractInstance = await tezos.contract.at(contractAddress);
  let storage;
  let balance;

  switch (type) {
    case PoolType.DEX_TWO:
      storage = await contractInstance.storage<StorageDexTwo>();

      return (await storage.storage.ledger.get([accountPkh, tokenId])) ?? null;
    case PoolType.TEZ_TOKEN:
      storage = await contractInstance.storage<StorageTezToken>();
      balance = await storage.storage.ledger.get(accountPkh);

      return balance?.balance ?? null;
    case PoolType.TOKEN_TOKEN:
      storage = await contractInstance.storage<StorageTokenToken>();
      balance = await storage.storage.ledger.get([accountPkh, tokenId]);

      return balance?.balance ?? null;
    default:
      throw Error('Invalid pool type');
  }
};
