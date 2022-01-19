import { QSNetwork, QSNetworkType } from '@utils/types';

export const isNetworkMainnet = (network: QSNetwork) => {
  return network.type === QSNetworkType.MAIN;
};
