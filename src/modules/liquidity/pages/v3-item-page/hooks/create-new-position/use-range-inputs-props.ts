import { useMemo } from 'react';

import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { CreatePositionFormik } from '@modules/liquidity/types';
import { TokenInputProps } from '@shared/components';
import { isExist, getTokenSymbol } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import { useTranslation } from '@translation';

import { CreatePositionInput, CreatePositionPriceInput, CreatePositionAmountInput } from '../../types';

export const useRangeInputsProps = (
  formik: CreatePositionFormik,
  tokensList: Nullable<Token[]>,
  priceRangeDecimals: number,
  handleInputChange: (
    inputSlug: CreatePositionAmountInput | CreatePositionPriceInput,
    inputDecimals: number
  ) => (value: string) => void,
  handleRangeInputBlur: (inputSlug: CreatePositionPriceInput) => () => void
) => {
  const { t } = useTranslation();
  const poolStore = useLiquidityV3PoolStore();

  return useMemo<TokenInputProps[]>(() => {
    const shouldShowTokenXToYPrice = poolStore.localShouldShowXToYPrice;
    const rangeInputsSlugs = [CreatePositionInput.MIN_PRICE, CreatePositionInput.MAX_PRICE] as const;
    let rangeInputsLabels = [t('liquidity|minPrice'), t('liquidity|maxPrice')];
    let quoteAsset: Nullable<Token>;
    if (isExist(tokensList)) {
      const [definedTokenX, definedTokenY] = tokensList;
      const pricePrefix = `: 1 ${getTokenSymbol(shouldShowTokenXToYPrice ? definedTokenY : definedTokenX)} =`;
      rangeInputsLabels = [`${t('liquidity|minPrice')}${pricePrefix}`, `${t('liquidity|maxPrice')}${pricePrefix}`];
      quoteAsset = shouldShowTokenXToYPrice ? definedTokenX : definedTokenY;
    }

    return rangeInputsSlugs.map((inputSlug, index) => ({
      value: formik.values[inputSlug],
      label: rangeInputsLabels[index],
      decimals: priceRangeDecimals,
      tokens: quoteAsset,
      readOnly: formik.values[CreatePositionInput.FULL_RANGE_POSITION],
      onInputChange: handleInputChange(inputSlug, priceRangeDecimals),
      hiddenBalance: true,
      hiddenPercentSelector: true,
      hiddenNotWhitelistedMessage: true,
      fullWidth: false,
      tokenLogoWidth: 32,
      hiddenUnderline: true,
      onBlur: handleRangeInputBlur(inputSlug)
    }));
  }, [t, tokensList, formik, priceRangeDecimals, handleInputChange, handleRangeInputBlur, poolStore]);
};
