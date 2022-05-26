import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface QuipuSwapContractAbstraction extends ContractAbstraction<ContractProvider> {
  methods: {
    tezToTokenPayment: (
      outputTokenAmount: BigNumber,
      receiverPublicKeyHash: string
    ) => ContractMethod<ContractProvider>;
    tokenToTezPayment: (
      inputTokenAmount: BigNumber,
      outputTezosAmount: BigNumber,
      receiverPublicKeyHash: string
    ) => ContractMethod<ContractProvider>;
  };
}

interface SwapStepParams {
  pair_id: number;
  operation: { a_to_b: object } | { b_to_a: object };
}

export interface QuipuSwapTokenToTokenContractAbstraction extends ContractAbstraction<ContractProvider> {
  methods: {
    swap: (
      swapsParams: SwapStepParams[],
      inputTokenAmount: BigNumber,
      outputTokenAmount: BigNumber,
      receiverPublicKeyHash: string,
      transactionTimeoutDate: string
    ) => ContractMethod<ContractProvider>;
  };
}
