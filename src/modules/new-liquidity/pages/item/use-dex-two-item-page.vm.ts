import { useEffect, useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { EMPTY_STRING } from '@config/constants';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { getSymbolsString, isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useDexTwoItemPageViewModel = () => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();
  const newLiquidityItemStore = useNewLiquidityItemStore();

  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug!);
    newLiquidityItemStore.itemSore.load();

    return () => newLiquidityItemStore.itemSore.resetData();
  }, [newLiquidityItemStore, pairSlug]);

  const title = useMemo(() => {
    const tokens = newLiquidityItemStore.item?.tokensInfo.map(({ token }) => token);
    if (!isExist(tokens)) {
      return EMPTY_STRING;
    }

    return getSymbolsString(tokens);
  }, [newLiquidityItemStore.item?.tokensInfo]);

  return {
    t,
    title,
    isInitialize: Boolean(newLiquidityItemStore.item)
  };
};
