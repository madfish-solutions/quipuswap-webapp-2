import { ConnectType, QSNetwork } from '@utils/types';

export const isDefaultConnectType = (network: QSNetwork) => {
  return network.connectType === ConnectType.DEFAULT;
};
