import { validateContractAddress } from '@taquito/utils';
import { i18n } from 'next-i18next';

export const isContractAddress = (value: string) => (
  validateContractAddress(value) === 3
    ? true
    : i18n?.t('common:You entered not a valid QP address')
);
