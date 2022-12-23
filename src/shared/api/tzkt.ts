import { stringify as stringifyQueryParams } from 'qs';

import { TZKT_API_CONTRACTS_URL } from '@config/config';
import { isUndefined } from '@shared/helpers';

export namespace Tzkt {
  export const getContractBigmapKeys = async <T>(
    contractAddress: string,
    bigmap: string,
    queryParams?: Record<string, unknown>
  ): Promise<Array<T>> => {
    const queryString = isUndefined(queryParams) ? '' : `?${stringifyQueryParams(queryParams)}`;
    // eslint-disable-next-line no-console
    console.log(`${TZKT_API_CONTRACTS_URL}/${contractAddress}/bigmaps/${bigmap}/keys${queryString}`);

    return fetch(`${TZKT_API_CONTRACTS_URL}/${contractAddress}/bigmaps/${bigmap}/keys${queryString}`).then(async res =>
      res.json()
    );
  };
}
