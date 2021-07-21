export interface QSNetwork {
  id:
  | 'mainnet'
  | 'florencenet'
  | 'edo2net'
  | 'edonet'
  | 'delphinet'
  | 'carthagenet';
  connectType: 'default' | 'custom';
  name: string;
  type: 'main' | 'test';
  rpcBaseURL: string;
  description: string;
  disabled: boolean;
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple',
}
