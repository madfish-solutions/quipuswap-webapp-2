import { ConnectType, QSNetwork } from '@shared/types';

export const isDefaultConnectType = (network: QSNetwork) => {
  return network.connectType === ConnectType.DEFAULT;
};
