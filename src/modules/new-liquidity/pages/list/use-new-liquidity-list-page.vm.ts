import { useEffect, useRef } from 'react';

import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

import { isHotPool } from '../../helpers';
import { useGetNewLiquidityList, useGetNewLiquidityStats, useNewLiquidityListStore } from '../../hooks';
import { PreparedLiquidityItem } from '../../interfaces';
import { mapLiquidityListItem } from './map-liquidity-list-item';

// const STEP = 10;

export const useNewLiquidityPageViewModel = () => {
  const isReady = useReady();
  const { list } = useNewLiquidityListStore();
  const { getNewLiquidityList } = useGetNewLiquidityList();
  const { getNewLiquidityStats } = useGetNewLiquidityStats();

  // const [shownItems, setShownItems] = useState<Array<PreparedLiquidityItem>>([]);

  const { t } = useTranslation();
  const title = t('common|Liquidity');

  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady) {
      void getNewLiquidityList();
      void getNewLiquidityStats();
    }
  }, [getNewLiquidityList, getNewLiquidityStats, isReady]);

  // useEffect(() => {
  //   let itemsToShow = 0;
  //
  //   if (lastElementRef.current) {
  //     const infiniteObserver = new IntersectionObserver(([entry]) => {
  //       if (entry.isIntersecting) {
  //         setShownItems(list.map(newLiquidityListDataHelper).splice(FISRT_INDEX, (itemsToShow += STEP)));
  //       }
  //     });
  //     infiniteObserver.observe(lastElementRef.current);
  //   }
  // }, [lastElementRef, list]);

  const dataList = list.map(mapLiquidityListItem) ?? [];
  const hotPools = dataList.filter(({ id, type }) => isHotPool(id, type));

  const shownItems: PreparedLiquidityItem[] = list.map(mapLiquidityListItem);
  // eslint-disable-next-line no-console
  console.log('list.vm', shownItems.length);

  return {
    title,
    list: shownItems,
    hotPools,
    lastElementRef
  };
};
