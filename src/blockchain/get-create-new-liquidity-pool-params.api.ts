import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { BlockchainTokenDictionary, convertToBlockchainToken } from '@modules/new-liquidity/api';
import { getContract } from '@shared/dapp';
import { isTezosToken } from '@shared/helpers';
import { AmountToken } from '@shared/types';

const NO_TZ_TOKEN_VALUE = 0;

const tryExtractMutezOrZero = (tokensAndAmounts: Array<AmountToken>) => {
  const tezosTokenAmount = tokensAndAmounts.find(token => isTezosToken(token.token));

  return tezosTokenAmount ? tezosTokenAmount.amount : new BigNumber(NO_TZ_TOKEN_VALUE);
};

const convertToBlockchainTokensDictionary = (tokensAndAmounts: Array<AmountToken>) =>
  tokensAndAmounts.reduce(
    (acc, { token, amount }, index) => ({ ...acc, ...convertToBlockchainToken(token, index) }),
    {} as BlockchainTokenDictionary
  );

const prepareNewPoolData = (tokensAndAmounts: Array<AmountToken>) => {
  const tokensPairParams = convertToBlockchainTokensDictionary(tokensAndAmounts);
  const [token_a_in, token_b_in] = tokensAndAmounts.map(({ amount }) => amount);
  const mutezAmount = tryExtractMutezOrZero(tokensAndAmounts);

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
