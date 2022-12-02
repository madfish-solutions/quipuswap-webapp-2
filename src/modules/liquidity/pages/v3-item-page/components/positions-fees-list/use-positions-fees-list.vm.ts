import { BlockchainLiquidityV3Api } from '@modules/liquidity/api';
import { useRootStore } from '@providers/root-store-provider';
import { defined, getSumOfNumbers, isGreaterThanZero } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useV3PositionsViewModel } from '../../use-v3-positions.vm';

export const usePositionsFeesListViewModel = () => {
  const { t } = useTranslation();
  const { contractAddress, positions, isLoading, error } = useV3PositionsViewModel();
  const { showErrorToast } = useToasts();
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();

  const positionsIdsWithFees = positions
    .filter(({ collectedFeesUsd }) => isGreaterThanZero(collectedFeesUsd))
    .map(({ id }) => id);

  const userTotalDepositInfo = {
    totalDepositAmount: getSumOfNumbers(positions.map(position => position.depositUsd)),
    totalDepositLoading: isLoading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = getSumOfNumbers(positions.map(position => position.collectedFeesUsd));

  const handleClaimAll = async () => {
    const logData = {
      contractAddress,
      positionsIds: positionsIdsWithFees.map(id => id.toNumber()),
      rewardsInUsd: claimablePendingRewardsInUsd.toNumber()
    };
    try {
      amplitudeService.logEvent('CLAIM_V3_FEES_CLICK', logData);
      await BlockchainLiquidityV3Api.claimFees(
        defined(tezos, 'tezos'),
        defined(contractAddress, 'contractAddress'),
        positionsIdsWithFees,
        defined(accountPkh, 'accountPkh'),
        transactionDeadline
      );
      amplitudeService.logEvent('CLAIM_V3_FEES_SUCCESS', logData);
    } catch (claimError) {
      showErrorToast(claimError as Error);
      amplitudeService.logEvent('CLAIM_V3_FEES_FAILED', logData);
    }
  };

  return {
    userTotalDepositInfo,
    isUserTotalDepositExist,
    handleClaimAll,
    translation: {
      claimFeeTranslation: t('liquidity|claimFee'),
      totalFeesTranslation: t('liquidity|totalFees'),
      totalDepositTranslation: t('liquidity|totalDeposit')
    },
    claimablePendingRewardsInUsd
  };
};
