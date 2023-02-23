import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { parseTransferParamsToParamsWithKind } from 'swap-router-sdk';

import { getApproveParams } from '@blockchain';
import { THREE_ROUTE_APP_ID } from '@config/config';
import { FIRST_INDEX, ZERO_AMOUNT } from '@config/constants';
import { THREE_ROUTE_CONTRACT_ADDRESS } from '@config/environment';
import { threeRouteTokenMatches } from '@modules/swap/helpers';
import { ThreeRouteSwapResponse, ThreeRouteToken } from '@modules/swap/types';
import { estimateFee } from '@shared/api';
import { getContract } from '@shared/dapp/get-storage-info';
import { decreaseByPercentage, toAtomic, isTezosToken } from '@shared/helpers';
import { Token } from '@shared/types';

export class ThreeRouteBlockchainApi {
  static async getSwapTransferParams(
    tezos: TezosToolkit,
    accountPkh: string,
    receiver: string,
    inputToken: Token,
    outputToken: Token,
    threeRouteTokens: ThreeRouteToken[],
    swap: ThreeRouteSwapResponse,
    slippageTolerance: BigNumber
  ) {
    const threeRouteContract = await getContract(tezos, THREE_ROUTE_CONTRACT_ADDRESS!);
    const [threeRouteInputToken, threeRouteOutputToken] = [inputToken, outputToken].map(token =>
      threeRouteTokens.find(threeRouteToken => threeRouteTokenMatches(threeRouteToken, token))
    );
    const atomicInputAmount = toAtomic(swap.input, inputToken);

    const hops = swap.chains
      .map(chain =>
        chain.hops.map(({ dex: dex_id, forward }, index) => ({
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          code: (index === FIRST_INDEX ? 1 : 0) + (forward ? 2 : 0),
          dex_id,
          amount_opt: index === FIRST_INDEX ? toAtomic(chain.input, inputToken) : null
        }))
      )
      .flat();
    const tezAmount = isTezosToken(inputToken) ? swap.input.toNumber() : ZERO_AMOUNT;

    return getApproveParams(tezos, THREE_ROUTE_CONTRACT_ADDRESS!, inputToken, accountPkh, atomicInputAmount, [
      threeRouteContract.methods
        .execute(
          threeRouteInputToken!.id,
          threeRouteOutputToken!.id,
          toAtomic(decreaseByPercentage(swap.output, slippageTolerance), outputToken).integerValue(
            BigNumber.ROUND_DOWN
          ),
          receiver,
          hops,
          THREE_ROUTE_APP_ID
        )
        .toTransferParams({ amount: tezAmount, mutez: false })
    ]);
  }

  static async estimateSwapFee(
    tezos: TezosToolkit,
    accountPkh: string,
    receiver: string,
    inputToken: Token,
    outputToken: Token,
    threeRouteTokens: ThreeRouteToken[],
    swap: ThreeRouteSwapResponse,
    slippageTolerance: BigNumber
  ) {
    return await estimateFee(
      tezos,
      accountPkh,
      await ThreeRouteBlockchainApi.getSwapTransferParams(
        tezos,
        accountPkh,
        receiver,
        inputToken,
        outputToken,
        threeRouteTokens,
        swap,
        slippageTolerance
      )
    );
  }

  static async doSwap(
    tezos: TezosToolkit,
    accountPkh: string,
    receiver: string,
    inputToken: Token,
    outputToken: Token,
    threeRouteTokens: ThreeRouteToken[],
    swap: ThreeRouteSwapResponse,
    slippageTolerance: BigNumber
  ) {
    const tradeTransferParams = await ThreeRouteBlockchainApi.getSwapTransferParams(
      tezos,
      accountPkh,
      receiver,
      inputToken,
      outputToken,
      threeRouteTokens,
      swap,
      slippageTolerance
    );

    const walletParamsWithKind = tradeTransferParams.map(tradeTransferParam =>
      parseTransferParamsToParamsWithKind(tradeTransferParam)
    );

    return await tezos.wallet.batch(walletParamsWithKind).send();
  }
}
