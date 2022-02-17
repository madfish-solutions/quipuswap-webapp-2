import { useState, useCallback, useEffect } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';
import useSWR from 'swr';

import { WhitelistedBaker } from '@interfaces/types';
import { isValidBakerAddress } from '@utils/validators';

import { getBakers } from './bakers';
import { getBakerMetadata, isAddressBelongsToBaker } from './bakersMetadata';

export interface DAppBakers {
  bakers: { data: WhitelistedBaker[]; loading: boolean; error?: string };
  searchBakers: { data: WhitelistedBaker[]; loading: boolean; error?: string };
}

const useDappBakers = () => {
  const [{ bakers, searchBakers }, setState] = useState<DAppBakers>({
    bakers: { loading: true, data: [] },
    searchBakers: { loading: false, data: [] }
  });

  const getBakersData = useCallback(async () => getBakers(), []);
  const { data: bakersData } = useSWR(['bakers-initial-data'], getBakersData);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      bakers: { loading: false, data: bakersData ?? [] }
    }));
  }, [bakersData]);

  const searchCustomBaker = useCallback(async (address: string) => {
    if (isValidBakerAddress(address)) {
      setState(prevState => ({
        ...prevState,
        searchBakers: { loading: true, data: [] }
      }));

      const customBaker = await getBakerMetadata(address);

      if (customBaker) {
        const baker = {
          address: customBaker.address,
          name: customBaker.name,
          logo: customBaker.logo,
          fee: customBaker.fee,
          freeSpace: new BigNumber(customBaker.freeSpace),
          votes: 0
        };
        setState(prevState => ({
          ...prevState,
          searchBakers: { loading: false, data: [baker] }
        }));
      } else {
        const isBaker = await isAddressBelongsToBaker(address);

        if (isBaker) {
          const baker = {
            address
          };
          setState(prevState => ({
            ...prevState,
            searchBakers: { loading: false, data: [baker] }
          }));
        } else {
          setState(prevState => ({
            ...prevState,
            searchBakers: { loading: false, data: [] }
          }));
        }
      }
    }
  }, []);

  const addCustomBaker = useCallback(
    (baker: WhitelistedBaker) => {
      setState(prevState => ({
        ...prevState,
        bakers: { ...bakers, data: [...bakers.data, baker] },
        searchBakers: { loading: false, data: [] }
      }));
    },
    [bakers]
  );

  return {
    bakers,
    searchBakers,
    addCustomBaker,
    searchCustomBaker
  };
};

export const [DAppBakerProvider, useBakers, useSearchBakers, useAddCustomBaker, useSearchCustomBaker] = constate(
  useDappBakers,
  v => v.bakers,
  v => v.searchBakers,
  v => v.addCustomBaker,
  v => v.searchCustomBaker
);
