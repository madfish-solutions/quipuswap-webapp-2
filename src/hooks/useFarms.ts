import { useEffect, useState, useMemo } from 'react';
import { findDex, FoundDex, Token } from '@quipuswap/sdk';

import {
  FarmingInfoType,
  QSMainNet,
  WhitelistedFarmOptional,
} from '@utils/types';
import {
  useAccountPkh,
  useFarmingContract,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import {
  TEZOS_TOKEN,
  STABLE_TOKEN,
  FARM_CONTRACT,
  TZKT_LINK_TESTNET,
  OPERATIONS,
  FACTORIES,
} from '@utils/defaults';
import { prettyPrice } from '@utils/helpers';

const fallbackPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
};

export const useFarms = () => {
  const tezos = useTezos();
  const network = useNetwork();
  const farmingContract = useFarmingContract();
  const accountPkh = useAccountPkh();
  const networkId:QSMainNet = useNetwork().id as QSMainNet;
  const [allFarms, setAllFarms] = useState<WhitelistedFarmOptional[]>([]);
  const farmContractUrl = useMemo(() => (FARM_CONTRACT
    ? `${TZKT_LINK_TESTNET}/${FARM_CONTRACT}/${OPERATIONS}`
    : '#'
  ), [FARM_CONTRACT]);

  useEffect(() => {
    const loadFarms = async () => {
      if (!tezos) return;
      if (!network) return;
      if (!farmingContract) return;

      const possibleFarms:Promise<FarmingInfoType | undefined>[] = new Array(
        +farmingContract?.storage.farms_count.toString(),
      )
        .fill(0)
        .map(async (x, id) => (farmingContract?.storage.farms.get(id)));

      const tempFarms = await Promise.all(possibleFarms);

      if (tempFarms) {
        const clearfarms = (tempFarms
          .filter((farm) => !!farm) as FarmingInfoType[]
        );

        const tokenContracts = clearfarms.map((farm) => {
          let asset:Token = { contract: '' };

          if (farm.stake_params.staked_token.fA2) {
            asset = {
              contract: farm.stake_params.staked_token.fA2.token,
              id: farm.stake_params.staked_token.fA2.id,
            };
          }

          if (farm.stake_params.staked_token.fA12) {
            asset = { contract: farm.stake_params.staked_token.fA12 };
          }

          if (!farm.stake_params.is_lp_staked_token) {
            return findDex(tezos, FACTORIES[networkId], asset);
          }

          return asset.contract.toString();
        });

        const tokenContractsResolved = await Promise
          .all<(string | Promise<FoundDex>)>(tokenContracts);

        if (tokenContractsResolved) {
          const whitelistedFarms:WhitelistedFarmOptional[] = clearfarms.map((farm, id) => ({
            id,
            tokenPair: fallbackPair,
            totalValueLocked: prettyPrice(Number(farm?.staked)),
            apy: '888%',
            daily: '0.008%',
            multiplier: '888',
            tokenContract: `${TZKT_LINK_TESTNET}/${tokenContractsResolved[id]}/${OPERATIONS}`,
            farmContract: farmContractUrl,
            projectLink: '#',
            analyticsLink: '#',
            remaining: new Date(Date.now() + 48 * 3600000),
            claimed: farm.claimed.toString(),
            isLpTokenStaked: farm.stake_params.is_lp_staked_token,
            stakedToken: farm.stake_params.staked_token,
          }));

          setAllFarms(whitelistedFarms);
        }
      }
    };

    loadFarms();
  }, [tezos, network, farmingContract, accountPkh]);

  return allFarms;
};
