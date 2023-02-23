import { ThreeRouteSwapResponse } from '../types';

export const getThreeRouteSwapSWRKey = (swap: ThreeRouteSwapResponse) => JSON.stringify(swap);
