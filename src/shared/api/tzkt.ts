import { stringify as stringifyQueryParams } from 'qs';

import { TZKT_API_CONTRACTS_URL } from '@config/config';
import { isUndefined } from '@shared/helpers';

import { jsonFetch } from './json-fetch';

export namespace Tzkt {
  export const getContractBigmapKeys = async <T>(
    contractAddress: string,
    bigmap: string,
    queryParams?: Record<string, unknown>
  ) => {
    const queryString = isUndefined(queryParams) ? '' : `?${stringifyQueryParams(queryParams)}`;

    return await jsonFetch<T[]>(`${TZKT_API_CONTRACTS_URL}/${contractAddress}/bigmaps/${bigmap}/keys${queryString}`);
  };
}
