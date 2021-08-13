import { WhitelistedBaker } from '@utils/types';

export const localSearchBaker = ({
  name,
  address,
} : WhitelistedBaker, input:string) => {
  const isName = name?.toLowerCase().includes(input.toLowerCase());
  const isContract = address?.toLowerCase().includes(input.toLowerCase());
  const res = (isName
    || isContract);
  return res;
};
