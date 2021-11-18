import { validateAddress, validateContractAddress, ValidationResult } from '@taquito/utils';
import { i18n } from 'next-i18next';
import { string as stringSchema } from 'yup';

export const isAddress = async (value: string) => {
  const isAddr = await validateAddress(value) === 3;
  const isContract = await validateContractAddress(value) === 3;
  return isAddr && !isContract
    ? undefined
    : i18n?.t('common|You entered not a valid address');
};

export const addressSchema = () => stringSchema().test(
  'valid-address',
  () => i18n?.t('common|You entered not a valid address') ?? '',
  async (value) => {
    if (typeof value !== 'string') {
      return true;
    }
    return await validateAddress(value) === ValidationResult.VALID;
  },
);
