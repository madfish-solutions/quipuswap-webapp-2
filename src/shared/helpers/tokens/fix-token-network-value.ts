import { NetworkType } from '@airgap/beacon-sdk';

import { Token } from '@shared/types';

export const fixTokenNetworkValue = (item: Token) => {
  if (item.hasOwnProperty('network')) {
    return {
      ...item,
      network: NetworkType.GHOSTNET
    };
  }

  return { ...item };
};
