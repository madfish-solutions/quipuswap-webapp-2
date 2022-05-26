import { TezosToolkit } from '@taquito/taquito';

import { RouteDirectionEnum } from '../../../enum/route-direction.enum';
import { TradeOperation } from '../../../interface/trade.interface';
import { getContract } from '../../../utils/contract.utils';
import { getTransactionTimeoutDate } from '../../../utils/transaction-deadline.util';
import { YouvesContractAbstraction } from '../interfaces/youves.contract-abstraction.interface';

export const getYouvesTransferParams = async (
  tradeOperation: TradeOperation,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
) => {
  const contract = await getContract<YouvesContractAbstraction>(tradeOperation.dexAddress, tezos);

  if (tradeOperation.direction === RouteDirectionEnum.Direct) {
    return contract.methods
      .tokenToCash(
        senderPublicKeyHash,
        tradeOperation.aTokenAmount,
        tradeOperation.bTokenAmount,
        getTransactionTimeoutDate()
      )
      .toTransferParams({ mutez: true });
  } else {
    return contract.methods
      .cashToToken(
        senderPublicKeyHash,
        tradeOperation.bTokenAmount,
        tradeOperation.aTokenAmount,
        getTransactionTimeoutDate()
      )
      .toTransferParams({ mutez: true });
  }
};
