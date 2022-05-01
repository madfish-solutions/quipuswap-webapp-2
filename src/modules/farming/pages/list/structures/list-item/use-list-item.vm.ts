import { useTranslation } from '@translation';
export const useListItemViewModal = () => {
  const { t } = useTranslation(['farm']);

  return {
    translation: {
      fullCardTooltipTranslation: t('farm|fullCardTooltip'),
      tokenContractTranslation: t('farm|tokenContract'),
      farmingContractTranslation: t('farm|farmingContract'),
      tvlTranslation: t('farm|tvl'),
      tvlTooltipTranslation: t('farm|tvlTooltip'),
      aprTranslation: t('farm|apr'),
      aprTooltipTranslation: t('farm|aprTooltip'),
      apyTranslation: t('farm|apy'),
      apyTooltipTranslation: t('farm|apyTooltip'),
      yourBalanceTranslation: t('farm|yourBalance'),
      yourBalanceTooltipTranslation: t('farm|yourBalanceTooltip'),
      yourDepositTranslation: t('farm|yourDeposit'),
      yourDepositTooltipTranslation: t('farm|yourDepositTooltip'),
      yourEarnedTranslation: t('farm|yourEarned'),
      yourEarnedTooltipTranslation: t('farm|yourEarnedTooltip')
    }
  };
};
