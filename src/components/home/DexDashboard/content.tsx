import React from 'react';
import { Trans } from 'next-i18next';

import { Tooltip } from '@components/ui/Tooltip';

type DEXDashboardDataProps = {
  id: number
  volume: string
  label: React.ReactNode
  currency?: string
}[];

export const DEXDashboardData: DEXDashboardDataProps = [
  {
    id: 0,
    volume: '8888888888888',
    currency: '$',
    label: (
      <Trans ns="home">
        <Tooltip
          content="TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity."
        >
          TVL
        </Tooltip>
      </Trans>),
  },
  {
    id: 1,
    volume: '888888888888888',
    currency: '$',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The accumulated cost of all assets traded via QuipuSwap today."
        >
          Daily Volume
        </Tooltip>
      </Trans>),
  },
  {
    id: 2,
    volume: '888888888888888',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The overall number of transactions conducted on QuipuSwap today."
        >
          Daily Transaction
        </Tooltip>
      </Trans>),
  },
  {
    id: 3,
    volume: '888888888888888',
    currency: '$',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The amount of fee rewards generated on QuipuSwap today and spread between the LP owners. (Directly pegged to Daily Volume)."
        >
          Daily Reward
        </Tooltip>
      </Trans>),
  },
  {
    id: 4,
    volume: '888888888888',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The current number of available Quipu tokens."
        >
          Total supply
        </Tooltip>
      </Trans>),
    currency: 'QPSP',
  },
  {
    id: 5,
    volume: '888888888888',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The number of unique addresses that currently provide liquidity on QuipuSwap."
        >
          LP Providers
        </Tooltip>
      </Trans>),
  },
  {
    id: 6,
    volume: '888888888888',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The number of liquidity pools currently active on QuipuSwap."
        >
          Pairs listed
        </Tooltip>
      </Trans>),
  },
  {
    id: 7,
    volume: '888888888888',
    label: (
      <Trans ns="home">
        <Tooltip
          content="The final number of Quipu tokens. (There will never be more Quipu tokens than that)"
        >
          Max Supply
        </Tooltip>
      </Trans>),
    currency: 'QPSP',
  },
];
