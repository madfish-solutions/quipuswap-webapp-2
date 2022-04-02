import { useCallback } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import useSWR, { Fetcher, Key, SWRConfiguration, SWRResponse, useSWRConfig } from 'swr';

import { useOnBlock } from './use-on-block';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey
): SWRResponse<Data, Error>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey> | null
): SWRResponse<Data, Error>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined
): SWRResponse<Data, Error>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey> | null,
  config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined
): SWRResponse<Data, Error>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: [any?, any?]
) {
  const { mutate } = useSWRConfig();
  const response = useSWR<Data, Error, SWRKey>(key, ...args);

  const refresh = useCallback(async () => mutate(key), [mutate, key]);
  useOnBlock(tezos, refresh);

  return response;
}

// eslint-disable-next-line import/no-default-export
export default useUpdateOnBlockSWR;
