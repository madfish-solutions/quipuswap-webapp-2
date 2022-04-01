import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

export const validateBalance = (balance: BigNumber) => (value: string) =>
  !value || balance.gte(new BigNumber(value)) ? undefined : i18n?.t('common|Insufficient funds');
