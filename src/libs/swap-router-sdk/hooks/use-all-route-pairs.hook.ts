import { useEffect, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { BlockInterface, EMPTY_BLOCK } from '../interface/block.interface';
import { ResponseInterface } from '../interface/response.interface';
import { RoutePair } from '../interface/route-pair.interface';

export const useAllRoutePairs = (webSocketUrl: string) => {
  const webSocketRef = useRef<WebSocket>();
  const refreshControlRef = useRef(Math.random());

  const [data, setData] = useState<RoutePair[]>([]);
  const [block, setBlock] = useState<BlockInterface>(EMPTY_BLOCK);
  const [hasFailed, setHasFailed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    refreshControlRef.current = Math.random();
  };

  useEffect(() => {
    webSocketRef.current = new WebSocket(webSocketUrl);

    webSocketRef.current.onerror = (errorEvent: Event) => {
      console.log(errorEvent);
      setHasFailed(true);
      setIsRefreshing(false);
    };

    webSocketRef.current.onmessage = event => {
      setHasFailed(false);
      setIsRefreshing(false);
      const rawResponse: ResponseInterface = JSON.parse(event.data);

      const allPairs = rawResponse.routePairs.map<RoutePair>(rawPair => ({
        ...rawPair,
        aTokenPool: new BigNumber(rawPair.aTokenPool),
        aTokenMultiplier: rawPair.aTokenMultiplier ? new BigNumber(rawPair.aTokenMultiplier) : undefined,
        bTokenPool: new BigNumber(rawPair.bTokenPool),
        bTokenMultiplier: rawPair.bTokenMultiplier ? new BigNumber(rawPair.bTokenMultiplier) : undefined
      }));

      const filteredPairs = allPairs.filter(pair => !pair.aTokenPool.isEqualTo(0) && !pair.bTokenPool.isEqualTo(0));

      setData(filteredPairs);
      setBlock(rawResponse.block);
    };

    return () => webSocketRef.current?.close();
  }, [webSocketUrl, refreshControlRef.current]);

  return { data, block, hasFailed, isRefreshing, onRefresh };
};
