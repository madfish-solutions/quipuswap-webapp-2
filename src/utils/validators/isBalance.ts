import { i18n } from 'next-i18next';

export const isBalance = (balance:number) => (value: string) => (
  !value || (+value >= 0 && +value <= balance)
    ? undefined
    : i18n?.t('common:Insufficient funds on wallet')
);
