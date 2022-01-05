import { ContractMethod, TezosToolkit, Wallet } from '@taquito/taquito';

export const batchOperations = async (tezos: TezosToolkit, operations: Array<ContractMethod<Wallet>>) =>
  operations.reduce((batch, operation) => batch.withContractCall(operation), tezos.wallet.batch());
