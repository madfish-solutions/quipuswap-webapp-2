import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { DUMMY_BAKER } from '@config/bakers';
import { SECONDS_IN_MINUTE } from '@config/constants';
import { LiquidityTokenInfo, PoolType } from '@modules/liquidity/interfaces';
import { getBlockchainTimestamp } from '@shared/helpers';
import { Token } from '@shared/types';

import { getAddLiquidityParams } from './get-add-liquidity-params';
import { getCreateNewLiquidityPoolParams } from './get-create-new-liquidity-pool-params.api';
import { getDexOneRemoveLiquidityParams } from './get-dex-one-remove-liquidity-params';
import { withApproveApiForManyTokens } from './with-approve.api';

interface IAccordance {
  contractAddress: string;
  id: BigNumber;
  type: PoolType;
  aToken: Token;
  bToken: Token;
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
  totalLpSupply: BigNumber;
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

  const tokensAndAmounts = [
    { amount: amounts.amountA, token: accordance.aToken },
    { amount: amounts.amountB, token: accordance.bToken }
  ];

  const addLiqParams = dexTwo.totalLpSupply.isZero()
    ? await getCreateNewLiquidityPoolParams(
        tezos,
        dexTwoContract.address,
        tokensAndAmounts,
        accountPkh,
        DUMMY_BAKER,
        deadline
      )
    : await getAddLiquidityParams(accountPkh, dexTwoContract, dexTwo.id, amounts, deadline, dexTwo.tokensInfo);

  try {
    return await withApproveApiForManyTokens(tezos, dexTwo.contractAddress, tokensAndAmounts, accountPkh, [
      removeLiqParams,
      addLiqParams
    ]);
  } catch (error) {
    throw Error('Error while migrating liquidity');
  }
};
