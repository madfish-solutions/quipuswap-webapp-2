import { validateAddress } from '@taquito/utils';
import { i18n } from 'next-i18next';

export const isAddress = async (value: string) => {
  const p = await validateAddress(value) === 3
    ? undefined
    : i18n?.t('common:You entered not a valid address');
  return p;
};
