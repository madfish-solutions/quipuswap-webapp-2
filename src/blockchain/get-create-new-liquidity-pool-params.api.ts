import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { mapTokenToBlockchainToken } from '@modules/new-liquidity/api';
import { getContract } from '@shared/dapp';
import { isTezosToken } from '@shared/helpers';
import { AmountToken } from '@shared/types';

const prepareNewPoolData = (tokensAndAmounts: Array<AmountToken>) => {
  const NO_TZ_TOKEN_VALUE = 0;

  const tokensPairParams = {};
  const amounts: Array<BigNumber> = [];
  let mutezAmount = new BigNumber(NO_TZ_TOKEN_VALUE);

  tokensAndAmounts.forEach(({ token, amount }, index) => {
    Object.assign(tokensPairParams, mapTokenToBlockchainToken(token, index));
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

export const getCreateNewLiquidityPoolParams = async (
  tezos: TezosToolkit,
  newLiquidityContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  accountPkh: string,
  candidate: string,
  timestamp: string
) => {
  const newLiquidityPoolContract = await getContract(tezos, newLiquidityContractAddress);

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

  return newLiquidityPoolContract.methodsObject
    .launch_exchange(params)
    .toTransferParams({ storageLimit: 10000, mutez: true, amount: mutezAmount.toNumber() });
};
