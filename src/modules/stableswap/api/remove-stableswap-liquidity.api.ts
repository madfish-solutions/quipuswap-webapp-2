import { ContractAbstraction, MichelsonMap, TezosToolkit, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { STABLESWAP_REFERRAL } from '@config/enviroment';
import { getFirstElement, isSingleElement } from '@shared/helpers';
import { AmountToken } from '@shared/types';

const isWithdrawInOneCoin = (tokensAndAmounts: Array<AmountToken>) => {
  const filteredTokenAmounts = tokensAndAmounts
    .map((element, index) => ({ ...element, index }))
    .filter(({ amount }) => amount.isGreaterThan('0'));

  return { isSingle: isSingleElement(filteredTokenAmounts), tokensAmounts: filteredTokenAmounts };
};

const getRemoveStableswapLiquidityParams = (
  stableswapPoolContract: ContractAbstraction<Wallet>,
  tokensAndAmounts: Array<AmountToken>,
  shares: BigNumber,
  deadline: Date,
  receiver: Nullable<string>,
  balanced: boolean
) => {
  const michelsonAmounts = new MichelsonMap<number, BigNumber>();
  const { isSingle, tokensAmounts } = isWithdrawInOneCoin(tokensAndAmounts);

  if (isSingle) {
    const tokenAmount = getFirstElement(tokensAmounts);
    const index = new BigNumber(tokenAmount.index);
    const amount = tokenAmount.amount;

    return stableswapPoolContract.methods
      .divest_one_coin(DEFAULT_STABLESWAP_POOL_ID, shares, index, amount, deadline, receiver, STABLESWAP_REFERRAL)
      .toTransferParams();
  }

  tokensAndAmounts.forEach(({ amount }, index) => michelsonAmounts.set(index, amount));

  if (balanced) {
    return stableswapPoolContract.methods
      .divest(DEFAULT_STABLESWAP_POOL_ID, michelsonAmounts, shares, deadline, receiver)
      .toTransferParams();
  } else {
    return stableswapPoolContract.methods
      .divest_imbalanced(DEFAULT_STABLESWAP_POOL_ID, michelsonAmounts, shares, deadline, receiver, STABLESWAP_REFERRAL)
      .toTransferParams();
  }
};

export const removeStableswapLiquidityApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  shares: BigNumber,
  deadline: Date,
  accountPkh: string,
  balanced: boolean,
  receiver: Nullable<string> = null
) => {
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const removeSwableswapLiquidityParams = getRemoveStableswapLiquidityParams(
    stableswapPoolContract,
    tokensAndAmounts,
    shares,
    deadline,
    receiverFixed,
    balanced
  );

  return await sendBatch(tezos, [removeSwableswapLiquidityParams]);
};
