import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { isEqual, isTezosToken, isTokenFa12, isTokenFa2, saveBigNumber } from '@shared/helpers';
import { address, AmountToken, nat, Token } from '@shared/types';

enum KeyChar {
  A = 'a',
  B = 'b'
}

interface TezToken {
  tez: never;
}

interface FA12Token {
  fa12: address;
}

interface FA2Token {
  fa2: {
    token: address;
    id: nat;
  };
}

export type BlockchainToken = TezToken | FA12Token | FA2Token;

// TODO: fix string to const string
export type BlockchainTokenDictionary = { [key: string]: BlockchainToken };

export const convertToBlockchainToken = (token: Token, index: number): BlockchainTokenDictionary => {
  const FIRST_TOKEN = 0;
  const keySymbol = isEqual(index, FIRST_TOKEN) ? KeyChar.A : KeyChar.B;

  if (isTokenFa2(token)) {
    return {
      [`token_${keySymbol}`]: {
        fa2: {
          token: token.contractAddress,
          id: saveBigNumber(token.fa2TokenId, new BigNumber(0))
        }
      }
    };
  } else if (isTokenFa12(token) && !isTezosToken(token)) {
    return {
      [`token_${keySymbol}`]: {
        fa12: token.contractAddress
      }
    };
  } else {
    return {
      [`token_${keySymbol}`]: {
        tez: {} as never
      }
    };
  }
};

const prepareNewPoolData = (tokensAndAmounts: Array<AmountToken>) => {
  const NO_TZ_TOKEN_VALUE = 0;

  const tokensPairParams = {};
  const amounts: Array<BigNumber> = [];
  let mutezAmount = new BigNumber(NO_TZ_TOKEN_VALUE);

  tokensAndAmounts.forEach(({ token, amount }, index) => {
    Object.assign(tokensPairParams, convertToBlockchainToken(token, index));
    amounts.push(amount);

    if (isTezosToken(token)) {
      mutezAmount = amount;
    }
  });

  const [token_a_in, token_b_in] = amounts;

  return {
    tokensPairParams,
    token_a_in,
    token_b_in,
    mutezAmount
  };
};

export const createNewLiquidityPoolApi = async (
  tezos: TezosToolkit,
  newLiquidityContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  accountPkh: string,
  candidate: string,
  timestamp: string
) => {
  const newLiquidityPoolContract = await tezos.wallet.at(newLiquidityContractAddress);

  const { tokensPairParams, token_a_in, token_b_in, mutezAmount } = prepareNewPoolData(tokensAndAmounts);

  const params = {
    pair: tokensPairParams,
    token_a_in: token_a_in,
    token_b_in: token_b_in,
    shares_receiver: accountPkh,
    candidate: candidate,
    deadline: timestamp,
    referral_code: QUIPUSWAP_REFERRAL_CODE
  };

  const addPoolTransferParams = newLiquidityPoolContract.methodsObject
    .launch_exchange(params)
    .toTransferParams({ storageLimit: 10000, mutez: true, amount: mutezAmount.toNumber() });

  return await withApproveApiForManyTokens(tezos, newLiquidityContractAddress, tokensAndAmounts, accountPkh, [
    addPoolTransferParams
  ]);
};
