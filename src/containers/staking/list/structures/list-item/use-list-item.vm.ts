import { useTranslation } from 'next-i18next';
export const useListItemViewModal = () => {
  const { t } = useTranslation(['stake']);

  return {
    translation: {
      selectTranslation: t('stake|select'),
      fullCardTooltipTranslation: t('stake|fullCardTooltip'),
      tokenContractTranslation: t('stake|tokenContract'),
      stakeContractTranslation: t('stake|stakeContract'),
      tvlTranslation: t('stake|tvl'),
      tvlTooltipTranslation: t('stake|tvlTooltip'),
      aprTranslation: t('stake|apr'),
      aprTooltipTranslation: t('stake|aprTooltip'),
      apyTranslation: t('stake|apy'),
      apyTooltipTranslation: t('stake|apyTooltip'),
      yourBalanceTranslation: t('stake|yourBalance'),
      yourBalanceTooltipTranslation: t('stake|yourBalanceTooltip'),
      yourDepositTranslation: t('stake|yourDeposit'),
      yourDepositTooltipTranslation: t('stake|yourDepositTooltip'),
      yourEarnedTranslation: t('stake|yourEarned'),
      yourEarnedTooltipTranslation: t('stake|yourEarnedTooltip')
    }
  };
};
