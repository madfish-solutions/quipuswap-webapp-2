import {TezosToolkit} from '@taquito/taquito';

import {getUserBalance} from '@utils/dapp';
import {WhitelistedToken} from '@utils/types';

import {fromDecimals} from './fromDecimals';

interface BalanceArgs {
  tezos: TezosToolkit | null;
  accountPkh?: string | null;
  token: WhitelistedToken;
  tokenNumber: 'first' | 'second';
  nonce?: number;
}

const curObj = {
  first: Date.now(),
  second: Date.now(),
};

export const getBalance = async ({
  tezos,
  accountPkh,
  token,
  tokenNumber,
  nonce = Date.now(),
}: BalanceArgs) => {
  let finalBalance = '0';
  if (tezos && accountPkh) {
    try {
      curObj[tokenNumber] = nonce;
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId,
      );
      if (balance && curObj[tokenNumber] === nonce) {
        finalBalance = fromDecimals(balance, token.metadata.decimals).toString();
      } else {
        finalBalance = '0';
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }
  return finalBalance;
};
