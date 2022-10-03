/* eslint-disable no-console */
import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useTranslation } from '@translation';

export const useCpmmViewModel = () => {
  const { t } = useTranslation();
  const params = useParams();
  const pairSlug = params['*']!.split('/')[1];
  const newLiquidityItemStore = useNewLiquidityItemStore();

  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug);

    console.log('loading', params);
    void newLiquidityItemStore.itemSore.load().then(() => {
      console.log('loaded');
    });

    return () => newLiquidityItemStore.itemSore.resetData();
  }, [newLiquidityItemStore, pairSlug, params]);

  return {
    t,
    title: newLiquidityItemStore.pageTitle,
    isInitialized: Boolean(newLiquidityItemStore.item)
  };
};
