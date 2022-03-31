import { validateContractAddress, ValidationResult } from '@taquito/utils';

// eslint-disable-next-line max-len
export const isValidContractAddress = (value: string) => validateContractAddress(value) === ValidationResult.VALID;

export const getContractAddressError = () => 'You entered not a valid QP address';
