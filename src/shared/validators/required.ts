import { i18n } from '../hooks';

export const required = (value: string | number) =>
  value && value !== '' ? undefined : i18n?.t('common|This field is required');
