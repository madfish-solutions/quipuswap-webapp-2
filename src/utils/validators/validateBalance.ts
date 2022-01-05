import BigNumber from 'bignumber.js';

import { appi18n } from '@app.i18n';

export const validateBalance = (balance: BigNumber) => (value: string) =>
  !value || balance.gte(new BigNumber(value)) ? undefined : appi18n.t('common|Insufficient funds');
