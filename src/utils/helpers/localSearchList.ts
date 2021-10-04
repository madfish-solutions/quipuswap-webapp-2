import { WhitelistedTokenList } from '@utils/types';

export const localSearchList = ({
  name,
  url,
} : WhitelistedTokenList, input:string) => name.toLowerCase().includes(input.toLowerCase())
|| url.toLowerCase().includes(input.toLowerCase());
