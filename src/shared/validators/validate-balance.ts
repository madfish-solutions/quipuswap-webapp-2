import BigNumber from 'bignumber.js';

import { i18n } from '../hooks';

export const validateBalance = (balance: BigNumber) => (value: string) =>
  !value || balance.gte(new BigNumber(value)) ? undefined : i18n?.t('common|Insufficient funds');
