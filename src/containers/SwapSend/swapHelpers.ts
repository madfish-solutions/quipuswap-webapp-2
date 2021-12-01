import { TezosToolkit } from '@taquito/taquito';
import {
  batchify,
  findDex,
  FoundDex,
  swap,
} from '@quipuswap/sdk';

import { FACTORIES } from '@utils/defaults';
import {
  QSMainNet,
  TokenDataMap,
  SwapFormValues,
  WhitelistedToken,
} from '@utils/types';
import { getValueForSDK, slippageToBignum, transformTokenDataToAsset } from '@utils/helpers';

export const submitForm = (
  values: SwapFormValues,
  tezos:TezosToolkit,
  tokensData:TokenDataMap,
  tabsState:string,
  networkId:QSMainNet,
  form:any,
  updateToast: (err:any) => void,
  handleSuccessToast: any,
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
      form.mutators.setValue('balance1', '');
      form.mutators.setValue('balance2', '');
      await op.confirmation();
      handleSuccessToast();
    } catch (e) {
      updateToast(e);
    }
  };
  asyncFunc();
};

type GetDexParams = {
  tezos: TezosToolkit
  networkId: QSMainNet
  token1: WhitelistedToken
  token2: WhitelistedToken
};

export const getDex = async ({
  tezos,
  networkId,
  token1,
  token2,
}: GetDexParams) : Promise<{ dexes: FoundDex[], storages: any }> => {
  const fromAsset = {
    contract: token1.contractAddress,
    id: token1.fa2TokenId ?? undefined,
  };
  const toAsset = {
    contract: token2.contractAddress,
    id: token2.fa2TokenId ?? undefined,
  };

  if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
    const dexbuf1 = await findDex(tezos, FACTORIES[networkId], fromAsset);
    const dexStorageBuf1:any = await dexbuf1.contract.storage();
    const dexbuf2 = await findDex(tezos, FACTORIES[networkId], toAsset);
    const dexStorageBuf2:any = await dexbuf2.contract.storage();
    return {
      dexes: [dexbuf1, dexbuf2],
      storages: [dexStorageBuf1, dexStorageBuf2],
    };
  }
  const dexbuf = await findDex(tezos, FACTORIES[networkId], token2.contractAddress === 'tez' ? fromAsset : toAsset);
  const dexStorageBuf:any = await dexbuf.contract.storage();
  return {
    dexes: [dexbuf],
    storages: [dexStorageBuf, undefined],
  };
};
