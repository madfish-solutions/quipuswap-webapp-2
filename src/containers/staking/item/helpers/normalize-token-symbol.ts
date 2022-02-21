import { shortize } from '@utils/helpers';
import { isValidContractAddress } from '@utils/validators';

export const normalizeTokenSymbol = (tokenSymbol: string) =>
  isValidContractAddress(tokenSymbol) ? shortize(tokenSymbol) : tokenSymbol;
