import BigNumber from 'bignumber.js';

import { i18n } from '@translation';

export const validateMinMaxNonStrict = (min: number, max: number) => (value: string) =>
  !value || (new BigNumber(value).gte(new BigNumber(min)) && new BigNumber(value).lte(new BigNumber(max)))
    ? undefined
    : i18n?.t('common|Value has to be a number between {{min}} and {{max}}', { min, max });
