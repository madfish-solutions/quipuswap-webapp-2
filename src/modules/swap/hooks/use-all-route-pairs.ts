import { useCallback, useEffect, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { ResponseInterface } from 'swap-router-sdk/dist/interface/response.interface';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import { isExist } from '@shared/helpers';
import { Optional } from '@shared/types';

const optionalStringToBigNumber = (value: Optional<string>) => (isExist(value) ? new BigNumber(value) : undefined);

const RECONNECT_TIMEOUT = 500;

export const useAllRoutePairs = (webSocketUrl: string) => {
  const webSocketRef = useRef<WebSocket>();

  const [data, setData] = useState<RoutePair[]>([]);
  const isReconnectingRef = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const initializeSocket = useCallback(() => {
    if (isReconnectingRef.current) {
      return;
    }

    webSocketRef.current = new WebSocket(webSocketUrl);

    const reconnect = () => {
      if (!mounted.current) {
        return;
      }

      isReconnectingRef.current = true;
      setTimeout(() => initializeSocket(), RECONNECT_TIMEOUT);
    };
    webSocketRef.current.onerror = reconnect;
    webSocketRef.current.onclose = reconnect;

    webSocketRef.current.onmessage = (event: MessageEvent<string>) => {
      isReconnectingRef.current = false;
      const rawResponse: ResponseInterface = JSON.parse(event.data);

      const allPairs = rawResponse.routePairs.map<RoutePair>(rawPair => ({
        ...rawPair,
        dexId: optionalStringToBigNumber(rawPair.dexId),
        aTokenPool: new BigNumber(rawPair.aTokenPool),
        aTokenMultiplier: optionalStringToBigNumber(rawPair.aTokenMultiplier),
        bTokenPool: new BigNumber(rawPair.bTokenPool),
        bTokenMultiplier: optionalStringToBigNumber(rawPair.bTokenMultiplier),
        cTokenPool: optionalStringToBigNumber(rawPair.cTokenPool),
        cTokenMultiplier: optionalStringToBigNumber(rawPair.cTokenMultiplier),
        dTokenPool: optionalStringToBigNumber(rawPair.dTokenPool),
        dTokenMultiplier: optionalStringToBigNumber(rawPair.dTokenMultiplier),
        initialA: optionalStringToBigNumber(rawPair.initialA),
        futureA: optionalStringToBigNumber(rawPair.futureA),
        fees: rawPair.fees && {
          liquidityProvidersFee: optionalStringToBigNumber(rawPair.fees.liquidityProvidersFee),
          stakersFee: optionalStringToBigNumber(rawPair.fees.stakersFee),
          interfaceFee: optionalStringToBigNumber(rawPair.fees.interfaceFee),
          devFee: optionalStringToBigNumber(rawPair.fees.devFee),
          swapFee: optionalStringToBigNumber(rawPair.fees.swapFee),
          auctionFee: optionalStringToBigNumber(rawPair.fees.auctionFee)
        },
        liquidity: optionalStringToBigNumber(rawPair.liquidity),
        sqrtPrice: optionalStringToBigNumber(rawPair.sqrtPrice),
        curTickIndex: optionalStringToBigNumber(rawPair.curTickIndex),
        curTickWitness: optionalStringToBigNumber(rawPair.curTickWitness),
        ticks:
          rawPair.ticks &&
          Object.fromEntries(
            Object.entries(rawPair.ticks).map(([key, tick]) => [
              key,
              {
                prev: new BigNumber(tick.prev),
                next: new BigNumber(tick.next),
                sqrtPrice: new BigNumber(tick.sqrtPrice),
                tickCumulativeOutside: new BigNumber(tick.tickCumulativeOutside),
                liquidityNet: new BigNumber(tick.liquidityNet)
              }
            ])
          ),
        lastCumulative: rawPair.lastCumulative && {
          time: rawPair.lastCumulative.time,
          tick: {
            sum: new BigNumber(rawPair.lastCumulative.tick.sum),
            blockStartValue: new BigNumber(rawPair.lastCumulative.tick.blockStartValue)
          }
        }
      }));

      const filteredPairs = allPairs.filter(
        pair =>
          !pair.aTokenPool.isZero() &&
          !pair.bTokenPool.isZero() &&
          (!pair.cTokenPool || !pair.cTokenPool.isZero()) &&
          (!pair.dTokenPool || !pair.dTokenPool.isZero())
      );

      setData(filteredPairs);
    };
  }, [webSocketUrl]);

  useEffect(() => {
    initializeSocket();

    return () => webSocketRef.current?.close();
  }, [initializeSocket]);

  return { data };
};
