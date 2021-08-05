import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

const fromNat = (amount: any, token: any) => new BigNumber(amount).div(10 ** token.decimals);

export const estimateTezToToken = (
  tezos:TezosToolkit,
  tezAmount: BigNumber,
  dexStorage: any,
  token: any,
) => {
  if (!tezAmount) return new BigNumber(0);

  const mutezAmount = tezos.format('tz', 'mutez', tezAmount) as any;

  const tezInWithFee = mutezAmount.times(997);
  const numerator = tezInWithFee.times(dexStorage.token_pool);
  const denominator = new BigNumber(dexStorage.tez_pool)
    .times(1000)
    .plus(tezInWithFee);
  const tokensOut = numerator.idiv(denominator);
  const na = fromNat(tokensOut, token);

  return na;
};
