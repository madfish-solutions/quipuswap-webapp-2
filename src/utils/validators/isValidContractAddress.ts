import { validateContractAddress, ValidationResult } from '@taquito/utils';

import { appi18n } from '@app.i18n';

// eslint-disable-next-line max-len
export const isValidContractAddress = (value: string) => validateContractAddress(value) === ValidationResult.VALID;

export const getContractAddressError = () => appi18n.t('common|You entered not a valid QP address');
