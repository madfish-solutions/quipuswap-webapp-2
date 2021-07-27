import { validateContractAddress } from '@taquito/utils';
import { i18n } from 'next-i18next';

export const isContractAddress = async (value: string) => {
  try {
    const p = await validateContractAddress(value) === 3
      ? true
      : i18n?.t('common:You entered not a valid QP address');
    return p;
  } catch (e) {
    console.log('ehor', e);
    return false;
  }
};
