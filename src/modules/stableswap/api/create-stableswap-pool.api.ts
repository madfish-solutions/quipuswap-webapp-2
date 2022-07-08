import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_TOKEN_ID } from '@config/constants';
import { isTokenFa2, saveBigNumber } from '@shared/helpers';
import { AmountToken, Token } from '@shared/types';

import { TokensValue } from '../types';

interface TokenInfo {
  rate_f: BigNumber;
  precision_multiplier_f: BigNumber;
  reserves: BigNumber;
}

interface StableswapTokenInfo {
  reserves: BigNumber;
  rateF: BigNumber;
  precisionMultiplierF: BigNumber;
}

interface FeeType {
  lp_f: BigNumber;
  stakers_f: BigNumber;
  ref_f: BigNumber;
}

export interface Fees {
  liquidityProvidersFee: BigNumber;
  stakersFee: BigNumber;
  interfaceFee: BigNumber;
}

export interface CreationParams extends StableswapTokenInfo {
  token: Token;
}

const mapTokenToBlockchainToken = (token: Token): TokensValue => {
  if (isTokenFa2(token)) {
    return {
      fa2: {
        token_address: token.contractAddress,
        token_id: saveBigNumber(token.fa2TokenId, new BigNumber(DEFAULT_TOKEN_ID))
      }
    };
  } else {
    return {
      fa12: token.contractAddress
    };
  }
};

const mapTokensInfo = ({ reserves, rateF, precisionMultiplierF }: StableswapTokenInfo): TokenInfo => ({
  rate_f: rateF,
  precision_multiplier_f: precisionMultiplierF,
  reserves
});

const mapToAmountToken = ({ token, reserves }: Pick<CreationParams, 'token' | 'reserves'>): AmountToken => ({
  token: token,
  amount: reserves
});

const mapStableswapFee = ({ liquidityProvidersFee, stakersFee, interfaceFee }: Fees) => ({
  lp_f: liquidityProvidersFee,
  stakers_f: stakersFee,
  ref_f: interfaceFee
});

const prepareNewPoolData = (creationParams: Array<CreationParams>, fees: Fees) => {
  const contractFees: FeeType = mapStableswapFee(fees);

  const inputTokens: Array<TokensValue> = [];
  const amountTokenList: Array<AmountToken> = [];
  const tokensInfo = new MichelsonMap<number, TokenInfo>();

  creationParams.forEach(({ token, reserves, rateF, precisionMultiplierF }, index) => {
    inputTokens.push(mapTokenToBlockchainToken(token));
    amountTokenList.push(mapToAmountToken({ token, reserves }));
    tokensInfo.set(index, mapTokensInfo({ reserves, rateF, precisionMultiplierF }));
  });

  return {
    inputTokens,
    tokensInfo,
    contractFees,
    amountTokenList
  };
};

export const createStableswapPoolApi = async (
  tezos: TezosToolkit,
  stableswapFactoryContractAddress: string,
  creationParams: Array<CreationParams>,
  amplificationParameter: BigNumber,
  fees: Fees,
  accountPkh: string,
  managers: string[] = []
) => {
  const { inputTokens, tokensInfo, contractFees, amountTokenList } = prepareNewPoolData(creationParams, fees);

  const stableswapPoolContract = await tezos.wallet.at(stableswapFactoryContractAddress);

  const addPoolTransferParams = stableswapPoolContract.methods
    .add_pool({
      amplificationParameter,
      inputTokens,
      tokensInfo,
      STABLESWAP_REFERRAL,
      managers,
      contractFees
    })
    .toTransferParams();

  const inputs = new MichelsonMap();

  tokensInfo.forEach((value, key) => inputs.set(key, { token: inputTokens[key], value: value.reserves }));

  const startDexTransferParams = stableswapPoolContract.methods.start_dex(inputs).toTransferParams();

  return await withApproveApiForManyTokens(tezos, stableswapFactoryContractAddress, amountTokenList, accountPkh, [
    addPoolTransferParams,
    startDexTransferParams
  ]);
};
