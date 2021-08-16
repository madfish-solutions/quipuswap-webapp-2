import { i18n } from 'next-i18next';

export const required = (value: string | number) => (
  value && value !== ''
    ? undefined
    : i18n?.t('common:This field is required')
);
