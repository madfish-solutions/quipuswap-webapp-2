import { ContractMethod, ContractProvider, TezosToolkit, Wallet, WalletOperation } from '@taquito/taquito';

export const walletSendOperation = async (
  tezos: TezosToolkit,
  tokenAResetOperator: ContractMethod<Wallet>,
  tokenBResetOperator: ContractMethod<Wallet>,
  tokenAUpdateOperator: ContractMethod<Wallet>,
  tokenBUpdateOperator: ContractMethod<Wallet>,
  transactionsParams: ContractMethod<ContractProvider | Wallet>
): Promise<WalletOperation> =>
  tezos.wallet
    .batch()
    .withContractCall(tokenAResetOperator)
    .withContractCall(tokenBResetOperator)
    .withContractCall(tokenAUpdateOperator)
    .withContractCall(tokenBUpdateOperator)
    .withContractCall(transactionsParams)
    .send();
