import { ConnectType } from "./connect-type";

export type QSMainNet = 'mainnet' | 'hangzhounet';

export enum QSNetworkType {
  MAIN = 'MAIN',
  TEST = 'TEST'
}

export interface QSNetwork {
  id: QSMainNet;
  connectType: ConnectType;
  name: string;
  type: QSNetworkType;
  rpcBaseURL: string;
  metadata: string;
  disabled: boolean;
}
