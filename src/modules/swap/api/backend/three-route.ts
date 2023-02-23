import BigNumber from 'bignumber.js';

import { THREE_ROUTE_API_AUTH_TOKEN, THREE_ROUTE_API_URL } from '@config/environment';

import { ThreeRouteDex, ThreeRouteSwapResponse, ThreeRouteToken } from '../../types';

export class ThreeRouteBackendApi {
  private static NUMBER_DISCRIMINATION_PREFIX = 'uniqueprefix';

  private static jsonWithBigNumberParser(origJSON: string): ReturnType<typeof JSON['parse']> {
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
    const response = await fetch(`${THREE_ROUTE_API_URL}${path}`, {
      headers: { Authorization: `Basic ${THREE_ROUTE_API_AUTH_TOKEN}` }
    });
    const rawJSON = await response.text();

    return ThreeRouteBackendApi.jsonWithBigNumberParser(rawJSON);
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
