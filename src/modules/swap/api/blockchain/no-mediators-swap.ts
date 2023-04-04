import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { getTradeOpParams, parseTransferParamsToParamsWithKind, Trade } from 'swap-router-sdk';

import { STABLESWAP_REFERRAL } from '@config/config';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { estimateFee } from '@shared/api';

export class NoMediatorsSwapBlockchainApi {
  static async getSwapTransferParams(
    tezos: TezosToolkit,
    accountPkh: string,
    trade: Trade,
    recipientPkh = accountPkh,
    deadlineTimespan?: BigNumber
  ) {
    return await getTradeOpParams(
      trade,
      accountPkh,
      tezos,
      STABLESWAP_REFERRAL,
      recipientPkh,
      deadlineTimespan?.toNumber(),
      QUIPUSWAP_REFERRAL_CODE.toNumber()
    );
  }

  static async estimateSwapFee(
    tezos: TezosToolkit,
    accountPkh: string,
    trade: Trade,
    recipientPkh = accountPkh,
    deadlineTimespan?: BigNumber
  ) {
    return await estimateFee(
      tezos,
      accountPkh,
      await NoMediatorsSwapBlockchainApi.getSwapTransferParams(tezos, accountPkh, trade, recipientPkh, deadlineTimespan)
    );
  }

  static async doSwap(
    tezos: TezosToolkit,
    accountPkh: string,
    trade: Trade,
    recipientPkh = accountPkh,
    deadlineTimespan?: BigNumber
  ) {
    const tradeTransferParams = await NoMediatorsSwapBlockchainApi.getSwapTransferParams(
      tezos,
      accountPkh,
      trade,
      recipientPkh,
      deadlineTimespan
    );

    const walletParamsWithKind = tradeTransferParams.map(tradeTransferParam =>
      parseTransferParamsToParamsWithKind(tradeTransferParam)
    );

    return await tezos.wallet.batch(walletParamsWithKind).send();
  }
}
