import { ConnectType, QSNetwork } from '@interfaces/types';

export const isDefaultConnectType = (network: QSNetwork) => {
  return network.connectType === ConnectType.DEFAULT;
};
