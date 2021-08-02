import { WhitelistedBaker } from '@utils/types';

export const localSearchBaker = ({
  name,
  contractAddress,
} : WhitelistedBaker, input:string) => {
  const isName = name?.toLowerCase().includes(input.toLowerCase());
  const isContract = contractAddress?.toLowerCase().includes(input.toLowerCase());
  const res = (isName
    || isContract);
  return res;
};
