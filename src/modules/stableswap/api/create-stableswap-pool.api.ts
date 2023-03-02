import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens, getWithWtezMintOnInputParams } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { QUIPU_TOKEN, WTEZ_TOKEN } from '@config/tokens';
import { getSumOfNumbers, isTezosToken, isTokenEqual, toAtomic } from '@shared/helpers';
import { mapTokensValue } from '@shared/mapping/map-token-value';
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
    {
      token: QUIPU_TOKEN,
      amount: creationPrice ? toAtomic(creationPrice, QUIPU_TOKEN) : new BigNumber('1')
    }
  ]; // .filter(({ amount }) => isGreaterThanZero(amount));
  const tokensInfo = new MichelsonMap<BigNumber, TokenInfo>();

  creationParams.forEach(({ token, reserves, rateF, precisionMultiplierF }, index) => {
    const wrappedToken = isTezosToken(token) ? WTEZ_TOKEN : token;
    inputTokens.push(mapTokensValue(wrappedToken));
    amountTokenList.push(mapToAmountToken({ token: wrappedToken, reserves }));
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
  const mutezToMint = getSumOfNumbers(
    amountTokenList.filter(({ token }) => isTokenEqual(token, WTEZ_TOKEN)).map(({ amount }) => amount)
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

  return await withApproveApiForManyTokens(
    tezos,
    stableswapFactoryContractAddress,
    amountTokenList,
    accountPkh,
    await getWithWtezMintOnInputParams(tezos, mutezToMint, accountPkh, [addPoolTransferParams, startDexTransferParams])
  );
};
