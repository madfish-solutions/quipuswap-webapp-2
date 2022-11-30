import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_TOKEN_ID } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import { isTokenFa2, saveBigNumber, toAtomic } from '@shared/helpers';
import { AmountToken, Nullable, Token, TokensValue } from '@shared/types';

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

const prepareNewPoolData = (creationParams: Array<CreationParams>, fees: Fees, creationPrice: Nullable<BigNumber>) => {
  const contractFees: FeeType = mapStableswapFee(fees);

  const inputTokens: Array<TokensValue> = [];
  const amountTokenList: Array<AmountToken> = [
    // 1,000 QUIPU
    {
      token: QUIPU_TOKEN,
      amount: creationPrice ? toAtomic(creationPrice, QUIPU_TOKEN) : new BigNumber('1')
    }
  ];
  const tokensInfo = new MichelsonMap<BigNumber, TokenInfo>();

  creationParams.forEach(({ token, reserves, rateF, precisionMultiplierF }, index) => {
    inputTokens.push(mapTokenToBlockchainToken(token));
    amountTokenList.push(mapToAmountToken({ token, reserves }));
    tokensInfo.set(new BigNumber(index), mapTokensInfo({ reserves, rateF, precisionMultiplierF }));
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
  creationPrice: Nullable<BigNumber>
) => {
  const { inputTokens, tokensInfo, contractFees, amountTokenList } = prepareNewPoolData(
    creationParams,
    fees,
    creationPrice
  );
  const stableswapPoolContract = await tezos.wallet.at(stableswapFactoryContractAddress);

  const addPoolTransferParams = stableswapPoolContract.methods
    .add_pool(
      amplificationParameter,
      inputTokens,
      tokensInfo,
      STABLESWAP_REFERRAL,
      [],
      contractFees.lp_f,
      contractFees.stakers_f,
      contractFees.ref_f
    )
    .toTransferParams({ storageLimit: 60000 });

  const inputs = new MichelsonMap();

  tokensInfo.forEach((value, key) => inputs.set(key, { token: inputTokens[key.toNumber()], value: value.reserves }));

  const startDexTransferParams = stableswapPoolContract.methods
    .start_dex(inputs)
    .toTransferParams({ storageLimit: 60000 });

  return await withApproveApiForManyTokens(tezos, stableswapFactoryContractAddress, amountTokenList, accountPkh, [
    addPoolTransferParams,
    startDexTransferParams
  ]);
};
