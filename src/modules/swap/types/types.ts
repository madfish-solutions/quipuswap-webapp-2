import { BigNumber } from 'bignumber.js';

export interface RouteFeesAndSlug extends RouteFees {
  tokenSlug: string;
}

export interface RouteFees {
  fee: BigNumber;
  devFee: BigNumber;
}
