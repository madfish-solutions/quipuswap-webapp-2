import { useEffect, useRef, useState } from 'react';

import { FISRT_INDEX } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { isHotPool } from '../../helpers';
import { useGetNewLiquidityList, useNewLiquidityListStore, useGetNewLiquidityStats } from '../../hooks';
import { newLiquidityListDataHelper, PreparedLiquidityItem } from './new-liquidity-list-data.helper';

const STEP = 10;

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const newLiquidityListStore = useNewLiquidityListStore();
  const { getNewLiquidityList } = useGetNewLiquidityList();
  const { getNewLiquidityStats } = useGetNewLiquidityStats();
  const [shownItems, setShownItems] = useState<Array<PreparedLiquidityItem>>([]);
  const { t } = useTranslation();
  const title = t('common|Liquidity');

  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady) {
      void getNewLiquidityList();
      void getNewLiquidityStats();
    }
  }, [getNewLiquidityList, getNewLiquidityStats, isReady]);

  useEffect(() => {
    let itemsToShow = 0;

    if (lastElementRef.current) {
      const infiniteObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setShownItems(
            newLiquidityListStore?.list?.map(newLiquidityListDataHelper).splice(FISRT_INDEX, (itemsToShow += STEP)) ??
              []
          );
        }
      });
      infiniteObserver.observe(lastElementRef.current);
    }
  }, [lastElementRef, newLiquidityListStore?.list]);

  const dataList = newLiquidityListStore?.list?.map(newLiquidityListDataHelper) ?? [];
  const hotPools = dataList.filter(({ id, type }) => isHotPool(id, type));

  return {
    title,
    list: shownItems,
    hotPools,
    lastElementRef
  };
};
