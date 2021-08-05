import { QSNetwork, WhitelistedToken } from '@utils/types';

export const searchToken = ({
  metadata,
  contractAddress,
  fa2TokenId,
  network: tokenNetwork,
} : WhitelistedToken, network:QSNetwork, oldInput:string, oldInputToken:string) => {
  const isName = metadata.name?.toLowerCase().includes(oldInput.toLowerCase());
  const isSymbol = metadata.symbol?.toLowerCase().includes(oldInput.toLowerCase());
  const isContract = contractAddress.toLowerCase().includes(oldInput.toLowerCase());
  let res = false;
  if (fa2TokenId || oldInputToken.length > 0) {
    let isFa2 = fa2TokenId === parseInt(oldInputToken, 10);
    if (!oldInputToken) isFa2 = true;
    res = ((isName
          || isSymbol
          || isContract)
          && isFa2);
  } else {
    res = (isName
          || isSymbol
          || isContract);
  }
  res = res && network.id === tokenNetwork;
  return res;
};
