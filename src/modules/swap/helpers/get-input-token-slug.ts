import { RouteDirectionEnum, TradeOperation } from 'swap-router-sdk';

import { isEqual } from '@shared/helpers';

export const getInputTokenSlug = (route: TradeOperation) =>
  isEqual(route.direction, RouteDirectionEnum.Direct) ? route.aTokenSlug : route.bTokenSlug;
