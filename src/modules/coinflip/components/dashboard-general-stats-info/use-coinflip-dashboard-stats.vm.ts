import { useEffect, useState } from 'react';

import { NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';

import { RPC_URLS } from '@config/enviroment';
import { DashboardGeneralStats } from '@modules/coinflip/interfaces/dashboard-general-stats.interface';
import { TokenToPlay } from '@modules/coinflip/stores';
import { bigNumberToString } from '@shared/helpers';
import { Token } from '@shared/types';

import { getCoinflipGeneralStats } from '../../api';

const COIN_FLIP_CONTRACT_ADDRESS_ITHACANET = 'KT1LVVEjsveEKc9hGHmDxrADRuenxRafjixd';

export const COINFLIP_CONTRACT_DECIMALS = 1e18;

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
  const [isLoading, setLoading] = useState<boolean>(true);
  const [generalStats, setGeneralStats] = useState<Nullable<DashboardGeneralStats>>(null);

  const currency = token.contractAddress === 'tez' ? TokenToPlay.Tezos : TokenToPlay.Quipu;

  useEffect(() => {
    const asyncLoad = async () => {
      const tezos = new TezosToolkit(RPC_URLS[NetworkType.ITHACANET]);
      setLoading(true);
      const coinflipGeneralStats = await getCoinflipGeneralStats(
        tezos,
        COIN_FLIP_CONTRACT_ADDRESS_ITHACANET,
        token.contractAddress
      );

      setLoading(false);

      setGeneralStats(coinflipGeneralStats);
    };
    void asyncLoad();
  }, [token]);

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
