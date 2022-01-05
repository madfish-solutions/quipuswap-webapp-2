import { appi18n } from '@app.i18n';

export const required = (value: string | number) =>
  value && value !== '' ? undefined : appi18n.t('common|This field is required');
