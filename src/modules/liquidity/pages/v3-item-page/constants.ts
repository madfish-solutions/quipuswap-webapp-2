import { AppRootRoutes } from '@app.router';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';

export const FULL_PATH_PREFIX = `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}`;
export const CREATE_POOL_RELATIVE_PATH = LiquidityRoutes.create;
export const POSITIONS_RELATIVE_PATH = '/:id';
export const POSITION_RELATIVE_PATH = '/:id/:tab/:positionId';
export const CREATE_POSITION_RELATIVE_PATH = '/:id/create';
