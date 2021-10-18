import { WhitelistedTokenList } from '@utils/types';

export const localSearchListByNameOrUrl = ({
  name,
  url,
} : WhitelistedTokenList, input:string) => name.toLowerCase().includes(input.toLowerCase())
|| url.toLowerCase().includes(input.toLowerCase());
