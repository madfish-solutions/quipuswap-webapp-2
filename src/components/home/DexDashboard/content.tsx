import React from 'react';
import { Trans } from 'next-i18next';

type DEXDashboardDataProps = {
  id: number
  volume: string
  label: React.ReactNode
  units?: string
}[];

export const DEXDashboardData: DEXDashboardDataProps = [
  {
    id: 0,
    volume: '888888888888888',
    label: <Trans ns="home">TVL</Trans>,
  },
  {
    id: 1,
    volume: '888888888888888',
    label: <Trans ns="home">Daily Volume</Trans>,
  },
  {
    id: 2,
    volume: '888888888888888',
    label: <Trans ns="home">Daily Transaction</Trans>,
  },
  {
    id: 3,
    volume: '888888888888888',
    label: <Trans ns="home">Daily Reward</Trans>,
  },
  {
    id: 4,
    volume: '888888888888888',
    label: <Trans ns="home">Total supply</Trans>,
    units: 'QPSP',
  },
  {
    id: 5,
    volume: '888888888888888',
    label: <Trans ns="home">LP Providers</Trans>,
  },
  {
    id: 6,
    volume: '888888888888888',
    label: <Trans ns="home">Pairs listed</Trans>,
  },
  {
    id: 7,
    volume: '888888888888888',
    label: <Trans ns="home">Max Supply</Trans>,
    units: 'QPSP',
  },
];
