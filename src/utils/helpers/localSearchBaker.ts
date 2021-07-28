import { QSNetwork, WhitelistedBaker } from '@utils/types';

export const localSearchBaker = ({
  name,
  contractAddress,
} : WhitelistedBaker, network:QSNetwork, input:string) => {
  const isName = name.toLowerCase().includes(input.toLowerCase());
  const isContract = contractAddress.toLowerCase().includes(input.toLowerCase());
  const res = (isName
    || isContract);
  //   res = res && network.id === tokenNetwork;
  return res;
};
