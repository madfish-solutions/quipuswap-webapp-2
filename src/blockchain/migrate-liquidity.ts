import { batchify } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { SECONDS_IN_MINUTE } from '@config/constants';
import { LiquidityTokenInfo, PoolType } from '@modules/new-liquidity/interfaces';
import { getBlockchainTimestamp } from '@shared/helpers';
import { Token, TokenAddress } from '@shared/types';

import { getAddLiquidityParams } from './get-add-liquidity-params';
import { getDexOneRemoveLiquidityParams } from './get-dex-one-remove-liquidity-params';
import { getApproveParams } from './with-approve.api';

interface IAccordance {
  contractAddress: string;
  id: BigNumber;
  type: PoolType;
  aToken: Token | TokenAddress;
  bToken: Token | TokenAddress;
}

interface IAmounts {
  amountA: BigNumber;
  amountB: BigNumber;
  shares: BigNumber;
}

interface IDexTwo {
  id: BigNumber;
  contractAddress: string;
  tokensInfo: Array<LiquidityTokenInfo>;
}

export const migrateLiquidity = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dexTwo: IDexTwo,
  accordance: IAccordance,
  amounts: IAmounts,
  dexOneBalanceLP: BigNumber,
  transactionDeadline: BigNumber
) => {
  const deadlineInSeconds = transactionDeadline.multipliedBy(SECONDS_IN_MINUTE).toNumber();

  const [dexOneContract, dexTwoContract, deadline] = await Promise.all([
    tezos.wallet.at(accordance.contractAddress),
    tezos.wallet.at(dexTwo.contractAddress),
    getBlockchainTimestamp(tezos, deadlineInSeconds).then(result => result.toString())
  ]);

  const removeLiqParams = await getDexOneRemoveLiquidityParams(
    dexOneContract,
    accordance.type,
    amounts.amountA,
    amounts.amountB,
    dexOneBalanceLP,
    deadline,
    accordance.id
  );

  const addLiqParams = await getAddLiquidityParams(
    accountPkh,
    dexTwoContract,
    dexTwo.id,
    amounts,
    deadline,
    dexTwo.tokensInfo
  );

  const addLiqParamsWithAllowanceA = await getApproveParams(
    tezos,
    dexTwo.contractAddress,
    accordance.aToken,
    accountPkh,
    amounts.amountA,
    [addLiqParams]
  );

  const addLiqParamsWithBothAllowances = await getApproveParams(
    tezos,
    dexTwo.contractAddress,
    accordance.bToken,
    accountPkh,
    amounts.amountB,
    addLiqParamsWithAllowanceA
  );

  try {
    return await batchify(tezos.wallet.batch([]), [removeLiqParams, ...addLiqParamsWithBothAllowances]).send();
  } catch (error) {
    throw Error('Error while migrating liquidity');
  }
};
