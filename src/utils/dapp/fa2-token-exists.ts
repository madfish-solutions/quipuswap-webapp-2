import { TezosToolkit } from '@taquito/taquito';

import { Standard } from '@graphql';
import { isNull } from '@utils/helpers';

import { getUserBalance } from './getUserBalance';

const SOME_ACCOUNT_ADDRESS = 'tz1TTXUmQaxe1dTLPtyD4WMQP6aKYK9C8fKw';

export const fa2TokenExists = async (tezos: TezosToolkit, tokenAddress: string, tokenId: number) => {
  try {
    const testBalance = await getUserBalance(tezos, SOME_ACCOUNT_ADDRESS, tokenAddress, Standard.Fa2, tokenId);

    return !isNull(testBalance);
  } catch {
    return false;
  }
};
