import { validateAddress, validateContractAddress, ValidationResult } from '@taquito/utils';
import { string as stringSchema } from 'yup';

import { appi18n } from '@app.i18n';

export const isAddress = async (value: string) => {
  const isAddr = validateAddress(value) === ValidationResult.VALID;
  const isContract = validateContractAddress(value) === ValidationResult.VALID;

  return isAddr && !isContract ? undefined : appi18n.t('common|You entered not a valid address');
};

export const addressSchema = () =>
  stringSchema().test(
    'valid-address',
    () => appi18n.t('common|You entered not a valid address') ?? '',
    value => {
      if (typeof value !== 'string') {
        return true;
      }

      return validateAddress(value) === ValidationResult.VALID;
    }
  );
