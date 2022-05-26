import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface YouvesContractAbstraction extends ContractAbstraction<ContractProvider> {
  methods: {
    tokenToCash: (
      receiverPublicKeyHash: string,
      inputTokenAmount: BigNumber,
      outputTokenAmount: BigNumber,
      transactionTimeoutDate: string
    ) => ContractMethod<ContractProvider>;
    cashToToken: (
      receiverPublicKeyHash: string,
      outputTokenAmount: BigNumber,
      inputTokenAmount: BigNumber,
      transactionTimeoutDate: string
    ) => ContractMethod<ContractProvider>;
  };
}
