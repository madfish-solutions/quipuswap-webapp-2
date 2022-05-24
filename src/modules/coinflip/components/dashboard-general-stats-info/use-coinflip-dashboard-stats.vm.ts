import { useEffect, useState } from 'react';

import { NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';

import { DEFAULT_COINFLIP_CONTRACT } from '@config/config';
import { RPC_URLS } from '@config/enviroment';
import { DashboardGeneralStats } from '@modules/coinflip/interfaces/dashboard-general-stats.interface';
import { TokenToPlay } from '@modules/coinflip/stores';
import { bigNumberToString, isTezosToken } from '@shared/helpers';
import { Token } from '@shared/types';
import { useToasts } from '@shared/utils';

import { getCoinflipGeneralStats } from '../../api';

interface DashboardGeneralStatsMapped {
  bank: Nullable<string>;
  gamesCount: Nullable<string>;
  payoutCoefficient: Nullable<string>;
  totalWins: Nullable<string>;
}

const DEFAULT_GENERAL_STATS: DashboardGeneralStatsMapped = {
  bank: null,
  gamesCount: null,
  payoutCoefficient: null,
  totalWins: null
};

export const useCoinflipDashboardStatsViewModel = (token: Token) => {
  const [isLoading, setLoading] = useState(true);
  const [generalStats, setGeneralStats] = useState<Nullable<DashboardGeneralStats>>(null);
  const { showErrorToast } = useToasts();

  const currency = isTezosToken(token) ? TokenToPlay.Tezos : TokenToPlay.Quipu;

  useEffect(() => {
    const asyncLoad = async () => {
      const tezos = new TezosToolkit(RPC_URLS[NetworkType.ITHACANET]);
      setLoading(true);
      try {
        const coinflipGeneralStats = await getCoinflipGeneralStats(
          tezos,
          DEFAULT_COINFLIP_CONTRACT,
          token.contractAddress
        );
        setGeneralStats(coinflipGeneralStats);
      } catch (error) {
        showErrorToast(error as Error);
      }

      setLoading(false);
    };
    void asyncLoad();
  }, [showErrorToast, token]);

  const generalStatsMapping = ({
    bank,
    gamesCount,
    payoutCoefficient,
    totalWins
  }: DashboardGeneralStats): DashboardGeneralStatsMapped => {
    return {
      bank: bank ? bigNumberToString(bank) : null,
      gamesCount: gamesCount ? bigNumberToString(gamesCount) : null,
      payoutCoefficient: payoutCoefficient ? bigNumberToString(payoutCoefficient) : null,
      totalWins: totalWins ? bigNumberToString(totalWins) : null
    };
  };

  const generalStatsMap = generalStats ? generalStatsMapping(generalStats) : DEFAULT_GENERAL_STATS;

  return { generalStats: generalStatsMap, currency, isLoading };
};
