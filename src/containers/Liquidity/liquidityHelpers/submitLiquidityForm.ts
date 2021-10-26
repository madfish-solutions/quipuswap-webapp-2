import {
  addLiquidity,
  batchify,
  findDex,
  getLiquidityShare,
  initializeLiquidity,
  removeLiquidity,
  voteForBaker,
} from '@quipuswap/sdk';
import {TezosToolkit, TransferParams} from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {FACTORIES} from '@utils/defaults';
import {LiquidityFormValues, QSMainNet, TokenDataMap, WhitelistedToken} from '@utils/types';
import {slippageToBignum, toDecimals} from '@utils/helpers';

import {rebalanceFunction} from './rebalanceFunction';
// import { oldRebalanceFunction } from './oldRebalanceFunction';

interface SubmitFormArgs {
  tezos: TezosToolkit;
  values: LiquidityFormValues;
  updateToast: (err: Error) => void;
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
          liquidityParams = await rebalanceFunction({
            dex,
            accountPkh,
            tezos,
            values,
            token2,
            tokensData,
            slippage,
            updateToast,
          });
          // liquidityParams = await oldRebalanceFunction({
          //   dex,
          //   accountPkh,
          //   tezos,
          //   values,
          //   token2,
          //   tokensData,
          //   networkId,
          //   updateToast
          // })
        } else {
          if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;

          if (values.balance1 && accountPkh) {
            const tezValue = toDecimals(new BigNumber(values.balance1), 6);
            liquidityParams = await addLiquidity(tezos, dex, {tezValue});
          }
        }
      }
    } catch (e: any) {
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
