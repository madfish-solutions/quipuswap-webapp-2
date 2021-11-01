import {
  addLiquidity,
  batchify,
  estimateTezToToken,
  estimateTokenInTez,
  FA1_2,
  findDex,
  getLiquidityShare,
  initializeLiquidity,
  removeLiquidity,
  swap,
  toContract,
  voteForBaker,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import {
  GeneralErrorException,
  LiquidityFormValues,
  QSMainNet,
  TokenDataMap,
  WhitelistedToken,
} from '@utils/types';
import { fromDecimals, getValueForSDK, slippageToBignum, toDecimals } from '@utils/helpers';
import { isError } from '@utils/validators';

interface SubmitFormArgs {
  tezos: TezosToolkit;
  values: LiquidityFormValues;
  updateToast: (err: GeneralErrorException) => void;
  handleSuccessToast: (text: string) => void;
  currentTab: string;
  token2: WhitelistedToken;
  tokensData: TokenDataMap;
  accountPkh?: string | null;
  networkId: QSMainNet;
}

export const submitForm = async ({
  tezos,
  values,
  updateToast,
  handleSuccessToast,
  currentTab,
  token2,
  tokensData,
  accountPkh,
  networkId,
}: SubmitFormArgs) => {
  try {
    let liquidityParams: TransferParams[] = [];
    const slippage = slippageToBignum(values.slippage).div(100);
    const toAsset = {
      contract: tokensData.second.token.address,
      id: tokensData.second.token.id ?? undefined,
    };
    try {
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset);
      if (currentTab === 'remove') {
        if (!accountPkh) return;
        const share = await getLiquidityShare(tezos, dex, accountPkh);
        const balance = toDecimals(new BigNumber(values.balance3), 6);
        const remParams = await removeLiquidity(tezos, dex, balance, slippage);
        const voter = await dex.storage.storage.voters.get(accountPkh);
        if (voter && new BigNumber(values.balance3).gt(share.frozen.plus(share.unfrozen))) {
          const invoteParams = await voteForBaker(tezos, dex, voter.candidate, new BigNumber(0));
          liquidityParams = invoteParams.concat(remParams);
        } else {
          liquidityParams = remParams;
        }
      } else if (currentTab === 'add') {
        if (values.rebalanceSwitcher) {
          if (!dex || !accountPkh || !tezos) return;
          try {
            const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
            const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
            const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
            const initialBto$ = estimateTezToToken(
              dex.storage,
              toDecimals(bal2, token2.metadata.decimals),
            );
            const total$ = initialAto$.plus(initialBto$).idiv(2);
            let inputValue: BigNumber;
            const val1 = initialAto$.minus(total$).abs();
            const val2 = toDecimals(bal2, token2.metadata.decimals)
              .minus(estimateTokenInTez(dex.storage, total$))
              .abs();

            const whichTokenPoolIsGreater = val1.gt(val2);
            if (whichTokenPoolIsGreater) {
              inputValue = val1;
            } else {
              inputValue = getValueForSDK(
                tokensData.second,
                fromDecimals(val2, token2.metadata.decimals),
                tezos,
              );
            }
            const fromAsset = 'tez';
            const swapParams = await swap(
              tezos,
              FACTORIES[networkId],
              !whichTokenPoolIsGreater ? toAsset : fromAsset,
              whichTokenPoolIsGreater ? toAsset : fromAsset,
              inputValue,
              slippage,
            );

            const tezValue = total$;

            const addParams = await addLiquidity(tezos, dex, { tezValue });

            liquidityParams = swapParams.concat(addParams);
            if (!token2.fa2TokenId) {
              const tokenContract = await toContract(tezos, token2.contractAddress);
              const approveParams = await FA1_2.approve(tokenContract, dex.contract.address, 0);
              liquidityParams = liquidityParams.concat(approveParams);
            }
          } catch (e: unknown) {
            // so if its not error, then fall silently and dont tell anybody
            if (isError(e)) {
              updateToast(e);
            }
          }
        } else {
          if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;

          if (values.balance1 && accountPkh) {
            const tezValue = toDecimals(new BigNumber(values.balance1), 6);
            liquidityParams = await addLiquidity(tezos, dex, { tezValue });
          }
        }
      }
    } catch (e: unknown) {
      // so if its not error, then fall silently and dont tell anybody
      if (isError(e)) {
        if (e.name === 'DexNotFoundError') {
          if (values.balance1 && values.balance2) {
            const strictFactories = {
              fa1_2Factory: FACTORIES[networkId].fa1_2Factory[0],
              fa2Factory: FACTORIES[networkId].fa2Factory[0],
            };
            const tezVal = toDecimals(new BigNumber(values.balance1), 6);
            const tokenVal = new BigNumber(values.balance2);
            liquidityParams = await initializeLiquidity(
              tezos,
              strictFactories,
              toAsset,
              tokenVal,
              tezVal,
            );
          }
        } else {
          updateToast(e);
        }
      }
    }
    const dop = await batchify(tezos.wallet.batch([]), liquidityParams);
    const op = await dop.send();
    await op.confirmation();
    if (currentTab === 'remove') {
      handleSuccessToast('liquidity|Divest completed!');
    } else {
      handleSuccessToast('liquidity|Invest completed!');
    }
  } catch (e: any) {
    updateToast(e);
  }
};
