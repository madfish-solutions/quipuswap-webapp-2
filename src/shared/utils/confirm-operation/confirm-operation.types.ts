import { TezosToolkit } from '@taquito/taquito';

export interface ConfirmOperationOptions {
  initializedAt?: number;
  fromBlockLevel?: number;
  signal?: AbortSignal;
}

export interface OperationMessage {
  message: string;
}

export type BlockResponse = Awaited<ReturnType<TezosToolkit['rpc']['getBlock']>>;
export type OperationEntry = BlockResponse['operations'][number][number];

export type ConfirmationToastProps = Pick<OperationEntry, 'hash'> & Partial<OperationMessage>;

export type OperationContentsOrOperationContentsAndResult = OperationEntry['contents'][number];
