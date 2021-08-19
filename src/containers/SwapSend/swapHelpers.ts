import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { batchify, swap } from '@quipuswap/sdk';

import { FACTORIES } from '@utils/defaults';
import {
  QSMainNet, SwapFormValues, TokenDataMap, TokenDataType,
} from '@utils/types';
import { slippageToBignum } from '@utils/helpers';

const toNat = (amount: any, decimals: number) => new BigNumber(amount)
  .times(10 ** decimals)
  .integerValue(BigNumber.ROUND_DOWN);

const isTez = (tokensData:TokenDataType) => tokensData.token.address === 'tez';

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
      const fromAsset = isTez(tokensData.first) ? 'tez' : {
        contract: tokensData.first.token.address,
        id: tokensData.first.token.id ?? undefined,
      };
      const toAsset = isTez(tokensData.second) ? 'tez' : {
        contract: tokensData.second.token.address,
        id: tokensData.second.token.id ?? undefined,
      };
      const slippage = slippageToBignum(values.slippage).div(100);
      const inputValue = isTez(tokensData.first)
        ? tezos!!.format('tz', 'mutez', values.balance1) as any
        : toNat(values.balance1, tokensData.first.token.decimals);
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

export const tokenToAsset = (token:TokenDataType) => (token.token.address === 'TEZ' ? 'tez' : {
  contract: token.token.address,
  id: token.token.id ?? undefined,
});
