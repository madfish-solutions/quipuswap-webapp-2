import { TezosToolkit } from '@taquito/taquito';
import { batchify, swap } from '@quipuswap/sdk';

import { FACTORIES } from '@utils/defaults';
import {
  QSMainNet, SwapFormValues, TokenDataMap,
} from '@utils/types';
import { getValueForSDK, slippageToBignum, transformTokenDataToAsset } from '@utils/helpers';

export const submitForm = (
  values: SwapFormValues,
  tezos:TezosToolkit,
  tokensData:TokenDataMap,
  tabsState:string,
  networkId:QSMainNet,
  updateToast: (err:string) => void,
) => {
  if (!tezos) return;
  const asyncFunc = async () => {
    try {
      const fromAsset = transformTokenDataToAsset(tokensData.first);
      const toAsset = transformTokenDataToAsset(tokensData.second);
      const slippage = slippageToBignum(values.slippage).div(100);
      const inputValue = getValueForSDK(tokensData.first, values.balance1, tezos);
      const swapParams = await swap(
        tezos,
        FACTORIES[networkId],
        fromAsset,
        toAsset,
        inputValue,
        slippage,
        tabsState === 'send' ? values.recipient : undefined,
      );
      const op = await batchify(
        tezos.wallet.batch([]),
        swapParams,
      ).send();
      await op.confirmation();
    } catch (e) {
      updateToast(e);
    }
  };
  asyncFunc();
};
