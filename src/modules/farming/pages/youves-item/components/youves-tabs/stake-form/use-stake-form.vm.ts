import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { MS_IN_SECOND, ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import { useRootStore } from '@providers/root-store-provider';
import { isNotDefined, toReal } from '@shared/helpers';
import { useAuthStore, useToken, useTokenBalance } from '@shared/hooks';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { StakeFormProps } from './stake-form-props.interface';
import { useStakeFormForming } from './use-stake-form-forming';

const getNowTimestampSeconds = () => Math.floor(Date.now() / MS_IN_SECOND);

export const useStakeFormViewModel = (): StakeFormProps => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();

  const { item, tokens, farmingAddress, currentStakeId, stakes, claimableRewards, longTermRewards } =
    useFarmingYouvesItemStore();
  const currentStake = stakes.find(stake => stake.id.eq(currentStakeId));
  const stakedToken = useToken(item?.stakedToken ?? null);
  const stakedTokenBalance = useTokenBalance(stakedToken);

  const getConfirmationMessageParams = useCallback(
    (amountToStakeAtoms: BigNumber) => {
      if (!item) {
        return {
          totalDeposit: undefined,
          waitingTimeSeconds: ZERO_AMOUNT_BN.toString(),
          rewardToken: QUIPU_TOKEN,
          lostRewardAmount: ZERO_AMOUNT_BN
        };
      }
      const currentAgeTimestamp = Math.floor(
        new Date(currentStake?.age_timestamp ?? ZERO_AMOUNT).getTime() / MS_IN_SECOND
      );
      const now = new BigNumber(getNowTimestampSeconds());

      const stakeAge = BigNumber.min(now.minus(currentAgeTimestamp), item.vestingPeriodSeconds);
      const stakedAmount = currentStake?.stake ?? ZERO_AMOUNT_BN;
      const newStakedAmount = stakedAmount.plus(amountToStakeAtoms);
      const newAgeTimestamp = now.minus(stakedAmount.times(stakeAge).idiv(newStakedAmount));
      const waitingTimeSeconds = Math.max(
        newAgeTimestamp.minus(now).plus(item.vestingPeriodSeconds).toNumber(),
        ZERO_AMOUNT
      );

      return {
        totalDeposit: currentStake?.stake,
        waitingTimeSeconds,
        rewardToken: item.rewardToken,
        lostRewardAmount: toReal(
          longTermRewards?.minus(claimableRewards ?? ZERO_AMOUNT_BN) ?? ZERO_AMOUNT_BN,
          item.rewardToken
        )
      };
    },
    [currentStake, item, claimableRewards, longTermRewards]
  );

  const form = useStakeFormForming(
    farmingAddress,
    currentStakeId,
    stakedToken,
    stakedTokenBalance,
    getConfirmationMessageParams
  );

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...form,
    disabled,
    tokens,
    balance: stakedTokenBalance
  };
};
