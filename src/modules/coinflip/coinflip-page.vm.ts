import { useEffect, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { fromDecimals } from '@shared/helpers';
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
    const payoutCoefficient = fromDecimals(
      coinflipStore?.generalStats.data?.payoutCoefficient ?? ZERO_BN,
      COINFLIP_CONTRACT_DECIMALS
    );
    const bidSize = fromDecimals(coinflipStore?.userLastGameInfo.data?.bidSize ?? ZERO_BN, token);

    return payoutCoefficient.multipliedBy(bidSize);
  }, [coinflipStore?.generalStats.data?.payoutCoefficient, coinflipStore?.userLastGameInfo.data?.bidSize, token]);

  return {
    isInitialized,
    wonAmount,
    result: coinflipStore?.userLastGameInfo.data?.status ?? null,
    currency: token?.metadata.symbol
  };
};
