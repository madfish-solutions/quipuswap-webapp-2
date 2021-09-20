import React from 'react';
import { Trans } from 'next-i18next';

type DEXDashboardDataProps = {
  id: number
  volume: string
  tooltip: string
  label: React.ReactNode
  currency?: string
}[];

export const DEXDashboardData: DEXDashboardDataProps = [
  {
    id: 0,
    volume: '8888888888888',
    currency: '$',
    tooltip: 'TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.',
    label: (
      <Trans ns="home">
        TVL
      </Trans>),
  },
  {
    id: 1,
    volume: '888888888888888',
    currency: '$',
    tooltip: 'The accumulated cost of all assets traded via QuipuSwap today.',
    label: (
      <Trans ns="home">
        Daily Volume
      </Trans>),
  },
  {
    id: 2,
    volume: '888888888888888',
    tooltip: 'The overall number of transactions conducted on QuipuSwap today.',
    label: (
      <Trans ns="home">
        Daily Transaction
      </Trans>),
  },
  {
    id: 3,
    volume: '888888888888',
    tooltip: 'The current number of available Quipu tokens.',
    label: (
      <Trans ns="home">
        Total supply
      </Trans>),
    currency: 'QPSP',
  },

  {
    id: 4,
    volume: '888888888888888',
    currency: '$',
    tooltip: 'The amount of fee rewards generated on QuipuSwap today and spread between the LP owners. (Directly pegged to Daily Volume).',
    label: (
      <Trans ns="home">
        Daily Reward
      </Trans>),
  },
  {
    id: 5,
    volume: '888888888888',
    tooltip: 'The number of unique addresses that currently provide liquidity on QuipuSwap.',
    label: (
      <Trans ns="home">
        LP Providers
      </Trans>),
  },
  {
    id: 6,
    volume: '888888888888',
    tooltip: 'The number of liquidity pools currently active on QuipuSwap.',
    label: (
      <Trans ns="home">
        Pairs listed
      </Trans>),
  },
  {
    id: 7,
    volume: '888888888888',
    tooltip: 'The final number of Quipu tokens. (There will never be more Quipu tokens than that)',
    label: (
      <Trans ns="home">
        Max Supply
      </Trans>),
    currency: 'QPSP',
  },
];
