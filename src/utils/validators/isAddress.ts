import { validateAddress, validateContractAddress, ValidationResult } from '@taquito/utils';
import { i18n } from 'next-i18next';
import { string as stringSchema } from 'yup';

export const isAddress = async (value: string) => {
  const isAddr = validateAddress(value) === ValidationResult.VALID;
  const isContract = validateContractAddress(value) === ValidationResult.VALID;
  return isAddr && !isContract
    ? undefined
    : i18n?.t('common|You entered not a valid address');
};

export const addressSchema = () => stringSchema().test(
  'valid-address',
  () => i18n?.t('common|You entered not a valid address') ?? '',
  (value) => {
    if (typeof value !== 'string') {
      return true;
    }
    return validateAddress(value) === ValidationResult.VALID;
  },
);
