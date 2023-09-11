import BigNumber from 'bignumber.js';

import { THREE_ROUTE_API_AUTH_TOKEN, THREE_ROUTE_API_URL } from '@config/environment';
import { jsonFetch } from '@shared/api';

import { ThreeRouteDex, ThreeRouteSwapResponse, ThreeRouteToken } from '../../types';

const TREE_ROUTE_VERSION = 'v3';

export class ThreeRouteBackendApi {
  private static NUMBER_DISCRIMINATION_PREFIX = 'uniqueprefix';

  private static jsonWithBigNumberParser(origJSON: string): ReturnType<(typeof JSON)['parse']> {
    const stringedJSON = origJSON.replace(
      /:\s*([-+Ee0-9.]+)/g,
      `: "${ThreeRouteBackendApi.NUMBER_DISCRIMINATION_PREFIX}$1"`
    );

    return JSON.parse(stringedJSON, (_, value) => {
      if (typeof value !== 'string' || !value.startsWith(ThreeRouteBackendApi.NUMBER_DISCRIMINATION_PREFIX)) {
        return value;
      }

      value = value.slice('uniqueprefix'.length);

      return new BigNumber(value);
    });
  }

  private static async getThreeRouteResponse(path: string) {
    return await jsonFetch(
      `${THREE_ROUTE_API_URL}/${TREE_ROUTE_VERSION}${path}`,
      {
        headers: { Authorization: `Basic ${THREE_ROUTE_API_AUTH_TOKEN}` }
      },
      ThreeRouteBackendApi.jsonWithBigNumberParser
    );
  }

  static async getSwap(
    inputTokenSymbol: string,
    outputTokenSymbol: string,
    realAmount: BigNumber
  ): Promise<ThreeRouteSwapResponse> {
    return await ThreeRouteBackendApi.getThreeRouteResponse(
      `/swap/${inputTokenSymbol}/${outputTokenSymbol}/${realAmount.toFixed()}`
    );
  }

  static async getTokens(): Promise<ThreeRouteToken[]> {
    return await ThreeRouteBackendApi.getThreeRouteResponse('/tokens');
  }

  static async getDexes(): Promise<ThreeRouteDex[]> {
    return await ThreeRouteBackendApi.getThreeRouteResponse('/dexes');
  }
}
