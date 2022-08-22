import { useEffect, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { toReal } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';

import { useCoinflipGeneralStats, useCoinflipStore, useGamersStats, useGamesUserInfo, useUserLastGame } from './hooks';

const ZERO_BN = new BigNumber('0');

export const useCoinflipPageViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const coinflipStore = useCoinflipStore();
  const token = coinflipStore?.token;
  const rootStore = useRootStore();
  const dAppReady = useReady();
  const { accountPkh } = useAuthStore();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getGamesUserInfo } = useGamesUserInfo();
  const { getCoinflipGeneralStats } = useCoinflipGeneralStats();
  const { getGamersStats } = useGamersStats();
  const { getUserLastGame } = useUserLastGame();

  useEffect(() => {
    (async () => {
      if (!dAppReady && prevAccountPkhRef.current === accountPkh) {
        return;
      }
      await getGamesUserInfo(accountPkh);
      await getCoinflipGeneralStats();
      await getGamersStats();
      await getUserLastGame();
      prevAccountPkhRef.current = accountPkh;
    })();
  }, [getGamesUserInfo, getCoinflipGeneralStats, getGamersStats, getUserLastGame, dAppReady, accountPkh, token]);

  useEffect(() => {
    (async () => {
      try {
        await rootStore.createCoinflipStore();
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  const wonAmount = useMemo(() => {
    const realPayoutCoefficient = toReal(
      coinflipStore?.generalStatsStore.model.payoutCoefficient ?? ZERO_BN,
      COINFLIP_CONTRACT_DECIMALS
    );
    const realBidSize = toReal(coinflipStore?.userLastGameInfo.model.bidSize ?? ZERO_BN, token);

    return realPayoutCoefficient.multipliedBy(realBidSize);
  }, [coinflipStore?.generalStatsStore.model.payoutCoefficient, coinflipStore?.userLastGameInfo.model.bidSize, token]);

  return {
    isInitialized,
    wonAmount,
    result: coinflipStore?.userLastGameInfo.model.status,
    currency: token?.metadata.symbol
  };
};
