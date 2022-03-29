import { QSNetwork, ConnectType } from 'types/types';

export const isDefaultConnectType = (network: QSNetwork) => {
  return network.connectType === ConnectType.DEFAULT;
};
