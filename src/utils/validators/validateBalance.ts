import { i18n } from 'next-i18next';

export const validateBalance = (balance: number) => (value: string) => (
  !value || (+value <= balance)
    ? undefined
    : i18n?.t('common:Insufficient funds')
);
