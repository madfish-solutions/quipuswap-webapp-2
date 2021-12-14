import { isFullBaker, WhitelistedBaker } from '@utils/types';

export const localSearchBaker = (baker : WhitelistedBaker, input:string) => {
  const search = input.toLowerCase();
  const isName = isFullBaker(baker) ? baker.name.toLowerCase().includes(search) : false;
  const isContract = baker.address.toLowerCase().includes(search);
  return isName || isContract;
};
