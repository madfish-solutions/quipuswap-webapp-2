import { estimateSwap, FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { FormApi } from 'final-form';

import {
  fromDecimals,
  isDexEqual,
  isTokenEqual,
  parseDecimals,
  toDecimals,
  transformTokenDataToAsset,
} from '@utils/helpers';
import {
  IQuipuSwapDEXStorage,
  QSMainNet,
  SwapFormValues,
  TokenDataMap,
  WhitelistedToken,
} from '@utils/types';
import { FACTORIES } from '@utils/defaults';

interface HandleInputChangeArgs {
  val: SwapFormValues;
  tezos?: TezosToolkit | null;
  lastChange: 'balance1' | 'balance2';
  form: FormApi<SwapFormValues, Partial<SwapFormValues>>;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  oldToken1: WhitelistedToken;
  oldToken2: WhitelistedToken;
  inputDex: FoundDex;
  outputDex: FoundDex;
  dexStorage: IQuipuSwapDEXStorage;
  oldInputDex: FoundDex;
  oldOutputDex: FoundDex;
  tokensData: TokenDataMap;
  formValues: SwapFormValues;
  networkId: QSMainNet;
  handleErrorToast: (error: any) => void;
  setRate1: (rate: BigNumber) => void;
  setRate2: (rate: BigNumber) => void;
  setPriceImpact: (priceImpact: BigNumber) => void;
  setOldTokens: (tokens: WhitelistedToken[]) => void;
  setOldDex: (dexes: FoundDex[]) => void;
}

export const handleInputChange = async ({
  val,
  tezos,
  lastChange,
  form,
  token1,
  token2,
  oldToken1,
  oldToken2,
  inputDex,
  outputDex,
  dexStorage,
  oldInputDex,
  oldOutputDex,
  tokensData,
  formValues,
  networkId,
  handleErrorToast,
  setRate1,
  setRate2,
  setPriceImpact,
  setOldDex,
  setOldTokens,
}: HandleInputChangeArgs) => {
  if (!tezos) return;
  if (Object.keys(val).length < 1) return;
  if (!val[lastChange] || val[lastChange].toString() === '.') {
    if (!val.balance1 && !val.balance2) return;
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
    return;
  }
  const isTokenToToken = token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez';
  if (!inputDex || !dexStorage || (isTokenToToken && !outputDex)) return;
  if (token1 === undefined || token2 === undefined) return;
  let lastChangeMod = lastChange;
  const isTokensSame = isTokenEqual(token1, oldToken1) && isTokenEqual(token2, oldToken2);
  const isValuesSame = val[lastChange] === formValues[lastChange];
  const isDex1Same = inputDex && oldInputDex && isDexEqual(inputDex, oldInputDex);
  const isDex2Same = outputDex && oldOutputDex && isDexEqual(outputDex, oldOutputDex);
  const isDexSame = isDex1Same || (isTokenToToken && isDex1Same && isDex2Same);
  if (isValuesSame && isTokensSame && isDexSame) return;
  if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) {
    return;
  }
  if (isValuesSame && !isTokensSame) {
    lastChangeMod = 'balance1';
  }
  const decimals1 =
    lastChangeMod === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;
  const decimals2 =
    lastChangeMod !== 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

  const inputWrapper = new BigNumber(
    lastChangeMod === 'balance1'
      ? parseDecimals(val.balance1, 0, Infinity, token1.metadata.decimals)
      : parseDecimals(val.balance2, 0, Infinity, token2.metadata.decimals),
  );
  const inputValueInner = toDecimals(inputWrapper, decimals1);
  const fromAsset = transformTokenDataToAsset(tokensData.first);
  const toAsset = transformTokenDataToAsset(tokensData.second);

  const valuesInner =
    lastChangeMod === 'balance1'
      ? { inputValue: inputValueInner }
      : { outputValue: inputValueInner };

  let sendDex;
  if (isTokenToToken && outputDex) {
    sendDex = { inputDex, outputDex };
  } else {
    sendDex = token2.contractAddress === 'tez' ? { outputDex: inputDex } : { inputDex };
  }
  try {
    const retValue = fromDecimals(
      await estimateSwap(tezos, FACTORIES[networkId], fromAsset, toAsset, valuesInner, sendDex),
      decimals2,
    );

    const result = new BigNumber(parseDecimals(retValue.toFixed(), 0, Infinity, decimals2));

    const tokenToTokenRate = new BigNumber(tokensData.first.exchangeRate).div(
      tokensData.second.exchangeRate,
    );

    let rate1buf = new BigNumber(result).div(val.balance2);
    if (lastChangeMod === 'balance1') {
      rate1buf = new BigNumber(val.balance1).div(result);
    }

    const priceImp = new BigNumber(1)
      .minus(rate1buf.exponentiatedBy(-1).div(tokenToTokenRate))
      .multipliedBy(100);
    setRate1(rate1buf);
    setRate2(rate1buf.exponentiatedBy(-1));
    setPriceImpact(priceImp);

    form.mutators.setValue(
      lastChangeMod === 'balance1' ? 'balance2' : 'balance1',
      result.toFixed(),
    );
  } catch (e) {
    handleErrorToast(e);
  }

  setOldTokens([token1, token2]);
  setOldDex([inputDex, outputDex]);
};
