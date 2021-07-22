import { validateContractAddress } from '@taquito/utils';

export const isValidContract = (address:string) => validateContractAddress(address) === 3;
