import BigNumber from 'bignumber.js';
import { i18n } from 'next-i18next';

export const validateMinMax = (min: number, max: number) => (value: string) => (
  !value || (new BigNumber(value).gte(min) && new BigNumber(value).lte(max))
    ? undefined
    : i18n?.t('common:Value has to be a number between {{min}} and {{max}}', { min, max })
);
