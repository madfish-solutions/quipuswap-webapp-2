import { TezosToolkit } from '@taquito/taquito';
import { batchify, findDex, FoundDex, swap } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { FormApi } from 'final-form';

import { FACTORIES } from '@utils/defaults';
import {
  IQuipuSwapDEXStorage,
  QSMainNet,
  SwapFormValues,
  TokenDataMap,
  WhitelistedToken,
} from '@utils/types';
import { getValueForSDK, slippageToBignum, transformTokenDataToAsset } from '@utils/helpers';

export const submitForm = (
  values: SwapFormValues,
  tezos: TezosToolkit,
  tokensData: TokenDataMap,
  tabsState: string,
  networkId: QSMainNet,
  form: FormApi<SwapFormValues, Partial<SwapFormValues>>,
  updateToast: (err: any) => void,
  handleSuccessToast: any,
) => {
  if (!tezos) return;
  const asyncFunc = async () => {
    try {
      const fromAsset = transformTokenDataToAsset(tokensData.first);
      const toAsset = transformTokenDataToAsset(tokensData.second);
      const slippage = slippageToBignum(values.slippage).div(100);
      const inputValue = getValueForSDK(tokensData.first, new BigNumber(values.balance1), tezos);
      const swapParams = await swap(
        tezos,
        FACTORIES[networkId],
        fromAsset,
        toAsset,
        inputValue,
        slippage,
        tabsState === 'send' ? values.recipient : undefined,
      );
      const op = await batchify(tezos.wallet.batch([]), swapParams).send();
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
  tezos: TezosToolkit;
  networkId: QSMainNet;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
};

export const getDex = async ({
  tezos,
  networkId,
  token1,
  token2,
}: GetDexParams): Promise<{ dexes: FoundDex[]; storages: IQuipuSwapDEXStorage[] }> => {
  const fromAsset = {
    contract: token1.contractAddress,
    id: token1.fa2TokenId ?? undefined,
  };
  const toAsset = {
    contract: token2.contractAddress,
    id: token2.fa2TokenId ?? undefined,
  };

  if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
    const findDexInput = await findDex(tezos, FACTORIES[networkId], fromAsset);
    const inputDexStorage: IQuipuSwapDEXStorage = await findDexInput.contract.storage();
    const findDexOutput = await findDex(tezos, FACTORIES[networkId], toAsset);
    const outputDexStorage: IQuipuSwapDEXStorage = await findDexOutput.contract.storage();
    return {
      dexes: [findDexInput, findDexOutput],
      storages: [inputDexStorage, outputDexStorage],
    };
  }
  const findDexForAsset = await findDex(
    tezos,
    FACTORIES[networkId],
    token2.contractAddress === 'tez' ? fromAsset : toAsset,
  );
  const assetDexStorage: IQuipuSwapDEXStorage = await findDexForAsset.contract.storage();
  return {
    dexes: [findDexForAsset],
    storages: [assetDexStorage],
  };
};
