import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { RouteDirectionEnum } from '../../../enum/route-direction.enum';
import { TradeOperation } from '../../../interface/trade.interface';
import { getContract } from '../../../utils/contract.utils';
import { getTransactionTimeoutDate } from '../../../utils/transaction-deadline.util';
import {
  QuipuSwapContractAbstraction,
  QuipuSwapTokenToTokenContractAbstraction
} from '../interfaces/quipu-swap.contract-abstraction.interface';

export const getQuipuSwapTransferParams = async (
  tradeOperation: TradeOperation,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
) => {
  const contract = await getContract<QuipuSwapContractAbstraction>(tradeOperation.dexAddress, tezos);

  if (tradeOperation.direction === RouteDirectionEnum.Direct) {
    return contract.methods.tezToTokenPayment(tradeOperation.bTokenAmount, senderPublicKeyHash).toTransferParams({
      amount: tradeOperation.aTokenAmount.toNumber(),
      mutez: true
    });
  } else {
    return contract.methods
      .tokenToTezPayment(tradeOperation.aTokenAmount, tradeOperation.bTokenAmount, senderPublicKeyHash)
      .toTransferParams({ mutez: true });
  }
};

export const getQuipuSwapTokenTokenTransferParams = async (
  tradeOperation: TradeOperation,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
) => {
  const contract = await getContract<QuipuSwapTokenToTokenContractAbstraction>(tradeOperation.dexAddress, tezos);

  return contract.methods
    .swap(
      [
        {
          pair_id: new BigNumber(tradeOperation.dexId ?? 0).toNumber(),
          operation: tradeOperation.direction === RouteDirectionEnum.Direct ? { a_to_b: {} } : { b_to_a: {} }
        }
      ],
      tradeOperation.aTokenAmount,
      tradeOperation.bTokenAmount,
      senderPublicKeyHash,
      getTransactionTimeoutDate()
    )
    .toTransferParams({ mutez: true });
};
