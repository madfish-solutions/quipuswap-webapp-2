import { i18n } from 'next-i18next';

export const validateRebalance = (localSwap: string, localInvest: string) => () => (
  (localSwap !== '0' && localInvest !== '0')
    ? undefined
    : i18n?.t('common|Value is too low for rebalance')
);
