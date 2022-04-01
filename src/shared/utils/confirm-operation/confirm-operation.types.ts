import { OperationEntry } from '@taquito/rpc';

export interface ConfirmOperationOptions {
  initializedAt?: number;
  fromBlockLevel?: number;
  signal?: AbortSignal;
}

export interface OperationMessage {
  message: string;
}

export type ConfirmationToastProps = Pick<OperationEntry, 'hash'> & Partial<OperationMessage>;
