import { useCallback } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import useSWR, { Fetcher, Key, SWRConfiguration, SWRResponse, useSWRConfig } from 'swr';

import { useOnBlock } from '@utils/dapp';

function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey
): SWRResponse<Data, Error>;
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey> | null
): SWRResponse<Data, Error>;
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined
): SWRResponse<Data, Error>;
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey> | null,
  config: SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>> | undefined
): SWRResponse<Data, Error>;
function useUpdateOnBlockSWR<Data = any, Error = any, SWRKey extends Key = null>(
  tezos: TezosToolkit | null,
  key: SWRKey,
  ...args: [any?, any?]
) {
  const { mutate } = useSWRConfig();
  const response = useSWR<Data, Error, SWRKey>(key, ...args);

  const refresh = useCallback(() => mutate(key), [mutate, key]);
  useOnBlock(tezos, refresh);

  return response;
}

export default useUpdateOnBlockSWR;
