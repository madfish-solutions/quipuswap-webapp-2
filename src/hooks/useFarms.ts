import { useEffect, useState, useMemo } from 'react';

import {
  FarmingInfoType,
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
  TZKT_LINK_MAINNET,
  OPERATIONS,
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
  const [allFarms, setAllFarms] = useState<WhitelistedFarmOptional[]>([]);
  const farmContractUrl = useMemo(() => (FARM_CONTRACT
    ? `${TZKT_LINK_TESTNET}/${FARM_CONTRACT}/${OPERATIONS}`
    : `${TZKT_LINK_MAINNET}/${FARM_CONTRACT}/${OPERATIONS}`
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

        console.log({clearfarms});

        const whitelistedFarms:WhitelistedFarmOptional[] = clearfarms
          .map((x, id) => ({
            id,
            tokenPair: fallbackPair,
            totalValueLocked: prettyPrice(Number(x?.staked)),
            apy: '888%',
            daily: '0.008%',
            multiplier: '888',
            tokenContract: `${TZKT_LINK_TESTNET}/${x.stake_params.staked_token.fA2?.token}/${OPERATIONS}`,
            farmContract: farmContractUrl,
            projectLink: '#',
            analyticsLink: '#',
            remaining: new Date(Date.now() + 48 * 3600000),
            claimed: x.claimed.toString(),
            isLpTokenStaked: x.stake_params.is_lp_staked_token,
            stakedToken: x.stake_params.staked_token,
          }));

        setAllFarms(whitelistedFarms);
      }
    };

    loadFarms();
  }, [tezos, network, farmingContract, accountPkh]);

  return allFarms;
};
