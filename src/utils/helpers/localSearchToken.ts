import { QSNetwork, WhitelistedToken } from '@utils/types';
import BigNumber from 'bignumber.js';

type WhitelistedOrCustomToken = WhitelistedToken & { network: string };

export const localSearchToken = ({
  metadata,
  contractAddress,
  fa2TokenId,
  network: tokenNetwork,
} : WhitelistedOrCustomToken,
network:QSNetwork, oldInput:string, oldInputToken:number) => {
  const isName = metadata?.name?.toLowerCase().includes(oldInput.toLowerCase());
  const isSymbol = metadata?.symbol?.toLowerCase().includes(oldInput.toLowerCase());
  const isContract = contractAddress.toLowerCase().includes(oldInput.toLowerCase());
  let res = false;
  if (fa2TokenId) {
    let isFa2 = new BigNumber(fa2TokenId).eq(new BigNumber(oldInputToken));
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
  if (tokenNetwork) {
    res = res && tokenNetwork === network.id;
  }
  return res;
};
