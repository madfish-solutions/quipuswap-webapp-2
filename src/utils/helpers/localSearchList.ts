import { WhitelistedTokenList } from '@utils/types';

export const localSearchList = ({
  name,
} : WhitelistedTokenList, input:string) => name.toLowerCase().includes(input.toLowerCase());
