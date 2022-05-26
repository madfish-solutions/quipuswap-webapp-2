import { RouteDirectionEnum } from '../enum/route-direction.enum';
import { RoutePairWithDirection } from '../interface/route-pair-with-direction.interface';
import { RoutePair } from '../interface/route-pair.interface';

export const getRoutePairsWithDirection = (routePairs: RoutePair[]) => {
  const directRoutePairs = routePairs.map<RoutePairWithDirection>(route => ({
    ...route,
    direction: RouteDirectionEnum.Direct
  }));

  const invertedRoutePairs = routePairs.map<RoutePairWithDirection>(route => ({
    ...route,
    aTokenSlug: route.bTokenSlug,
    bTokenSlug: route.aTokenSlug,
    aTokenPool: route.bTokenPool,
    bTokenPool: route.aTokenPool,
    aTokenMultiplier: route.bTokenMultiplier,
    bTokenMultiplier: route.aTokenMultiplier,
    direction: RouteDirectionEnum.Inverted
  }));

  return [...directRoutePairs, ...invertedRoutePairs];
};
