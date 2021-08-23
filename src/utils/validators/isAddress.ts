import { validateAddress, validateContractAddress } from '@taquito/utils';
import { i18n } from 'next-i18next';

export const isAddress = async (value: string) => {
  const isAddr = await validateAddress(value) === 3;
  const isContract = await validateContractAddress(value) === 3;
  return isAddr && !isContract
    ? undefined
    : i18n?.t('common:You entered not a valid address');
};
