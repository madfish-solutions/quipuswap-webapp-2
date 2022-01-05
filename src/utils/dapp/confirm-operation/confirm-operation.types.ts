import { OperationEntry } from '@taquito/rpc';

export interface ConfirmOperationOptions {
  initializedAt?: number;
  fromBlockLevel?: number;
  signal?: AbortSignal;
}

export type ConfirmationToastProps = Pick<OperationEntry, 'hash'>;
