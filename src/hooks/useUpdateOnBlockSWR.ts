import { useCallback } from 'react';

import useSWR, { Fetcher, Key, SWRConfiguration, SWRResponse, useSWRConfig } from 'swr';

import { useOnBlock } from '@utils/dapp';

function useUpdateOnBlockSWR<Data, Error = typeof Error, SWRKey extends Key = null>(
  key: SWRKey
): SWRResponse<Data, Error>;

function useUpdateOnBlockSWR<Data, Error = typeof Error, SWRKey extends Key = null>(
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey> | null
): SWRResponse<Data, Error>;

function useUpdateOnBlockSWR<Data, Error = typeof Error, SWRKey extends Key = null>(
  key: SWRKey,
  config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined
): SWRResponse<Data, Error>;

function useUpdateOnBlockSWR<Data, Error = typeof Error, SWRKey extends Key = null>(
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey> | null,
  config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined
): SWRResponse<Data, Error>;

function useUpdateOnBlockSWR<Data, Error, SWRKey extends Key = null>(
  key: SWRKey,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: [any?, any?]
) {
  const { mutate } = useSWRConfig();
  const response = useSWR<Data, Error, SWRKey>(key, ...args);

  const refresh = useCallback(async () => mutate(key), [mutate, key]);
  useOnBlock(refresh);

  return response;
}

// eslint-disable-next-line import/no-default-export
export default useUpdateOnBlockSWR;
