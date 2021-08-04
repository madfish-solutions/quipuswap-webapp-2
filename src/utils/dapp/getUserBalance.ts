import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import { getStorageInfo } from './getStorageInfo';

export const getUserBalance = async (
  tezos: TezosToolkit,
  accountPkh: string,
  contract: string,
  type: 'fa1.2' | 'fa2' = 'fa1.2',
  tokenId?: number,
) => {
  if (contract === 'tez') {
    const amount = await tezos.tz.getBalance(accountPkh);
    return amount;
  }
  const storage = await getStorageInfo(tezos, contract);
  let val = null;
  if (type === 'fa1.2') {
    const { ledger, token } = storage;
    if (!ledger && !token) {
      return null;
    }
    if (ledger) {
      val = await ledger.get(accountPkh);
    }
    if (token) {
      val = await token.ledger.get(accountPkh);
    }
  } else {
    const { assets } = storage;
    if (!assets) {
      return null;
    }
    val = await assets.ledger.get([accountPkh, tokenId]);
  }

  if (!val) {
    return null;
  }

  const finalVal = new BigNumber(val);
  if (finalVal.toNumber()) {
    return finalVal;
  }

  const finalValBalance = new BigNumber(val.balance);
  if (!finalValBalance) {
    return null;
  }

  return finalValBalance;
};
