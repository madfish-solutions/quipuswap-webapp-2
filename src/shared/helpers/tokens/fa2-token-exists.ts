import { TezosToolkit } from '@taquito/taquito';

import { getUserBalance } from '@blockchain';
import { Standard } from '@shared/types';

import { isNull } from '../type-checks';

const SOME_ACCOUNT_ADDRESS = 'tz1TTXUmQaxe1dTLPtyD4WMQP6aKYK9C8fKw';

/**
 * Checks that token with specified address and id exists by trying to get balance of known account
 * @param tezos Tezos toolkit instance
 * @param tokenAddress address of FA2 token
 * @param tokenId id of FA2 token
 * @returns `true` if call was successful; otherwise returns `false`
 */
export const fa2TokenExists = async (tezos: TezosToolkit, tokenAddress: string, tokenId: number) => {
  try {
    const testBalance = await getUserBalance(tezos, SOME_ACCOUNT_ADDRESS, tokenAddress, Standard.Fa2, tokenId);

    return !isNull(testBalance);
  } catch {
    return false;
  }
};
