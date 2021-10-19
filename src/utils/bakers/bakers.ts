import {
  useState, useEffect, useCallback,
} from 'react';
import useSWR from 'swr';
import constate from 'constate';
import BigNumber from 'bignumber.js';
import { validateAddress } from '@taquito/utils';

import { WhitelistedBaker } from '@utils/types';
import { getBakerMetadata } from './getBakerMetadata';
import { getBakers } from './getBakers';

export type BakerListType = {
  bakers: { data:WhitelistedBaker[], loading:boolean, error?:string },
  searchBakers: { data:WhitelistedBaker[], loading:boolean, error?:string },
};

function useBakerList() {
  const [{
    bakers,
    searchBakers,
  }, setState] = useState<BakerListType>({
    bakers: { loading: true, data: [] },
    searchBakers: { loading: false, data: [] },
  });

  const getBakersData = useCallback(() => getBakers(), []);
  const {
    data: bakersData,
  } = useSWR(
    ['bakers-initial-data'],
    getBakersData,
  );

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      bakers: { loading: false, data: bakersData ?? [] },
    }));
  }, [bakersData]);

  const searchCustomBaker = useCallback(
    async (address: string) => {
      if (await validateAddress(address) === 3) {
        setState((prevState) => ({
          ...prevState,
          searchBakers: { loading: true, data: [] },
        }));
        const customBaker = await getBakerMetadata(address);
        if (customBaker) {
          const baker = {
            address: customBaker.address,
            name: customBaker.name,
            logo: customBaker.logo,
            fee: customBaker.fee,
            freeSpace: new BigNumber(customBaker.freeSpace),
            votes: 0,
          } as WhitelistedBaker;
          setState((prevState) => ({
            ...prevState,
            searchBakers: { loading: false, data: [baker] },
          }));
        }
      }
    },
    [],
  );

  const addCustomBaker = useCallback((baker:WhitelistedBaker) => {
    setState((prevState) => ({
      ...prevState,
      bakers: { ...bakers, data: [...bakers.data, baker] },
      searchBakers: { loading: false, data: [] },
    }));
  }, [bakers]);

  return {
    bakers,
    searchBakers,
    addCustomBaker,
    searchCustomBaker,
  };
}

export const [
  BakerListProvider,
  useBakers,
  useSearchBakers,
  useAddCustomBaker,
  useSearchCustomBaker,
] = constate(
  useBakerList,
  (v) => v.bakers,
  (v) => v.searchBakers,
  (v) => v.addCustomBaker,
  (v) => v.searchCustomBaker,
);
