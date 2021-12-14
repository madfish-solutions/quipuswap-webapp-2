import React from 'react';

import { Trans } from 'next-i18next';

type DEXDashboardDataProps = {
  id: number;
  volume: string;
  tooltip: string;
  label: React.ReactNode;
  currency?: string;
}[];

export const DEXDashboardData: DEXDashboardDataProps = [
  {
    id: 0,
    volume: '8888888888888',
    currency: '$',
    tooltip:
      'TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.',
    label: <Trans ns="home">TVL</Trans>
  },
  {
    id: 1,
    volume: '888888888888888',
    currency: '$',
    tooltip: 'The accumulated cost of all assets traded via QuipuSwap today.',
    label: <Trans ns="home">Daily Volume</Trans>
  },
  {
    id: 2,
    volume: '888888888888888',
    tooltip: 'The overall number of transactions conducted on QuipuSwap today.',
    label: <Trans ns="home">Daily Transaction</Trans>
  },
  {
    id: 3,
    volume: '888888888888',
    tooltip: 'The current number of available Quipu tokens.',
    label: <Trans ns="home">Total supply</Trans>,
    currency: 'QPSP'
  }
];
