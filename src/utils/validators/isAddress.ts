import { validateAddress, validateContractAddress, ValidationResult } from '@taquito/utils';
import { i18n } from 'next-i18next';
import { string as stringSchema, ValidationError } from 'yup';

export const isAddress = async (value: string) => {
  const isAddr = await validateAddress(value) === 3;
  const isContract = await validateContractAddress(value) === 3;
  return isAddr && !isContract
    ? undefined
    : i18n?.t('common|You entered not a valid address');
};

export const addressSchema = () => stringSchema().test(
  async (value) => {
    if (typeof value !== 'string') {
      return false;
    }
    const isValid = await validateAddress(value) === ValidationResult.VALID;

    return isValid || new ValidationError(i18n?.t('common|You entered not a valid address') ?? '');
  },
);
