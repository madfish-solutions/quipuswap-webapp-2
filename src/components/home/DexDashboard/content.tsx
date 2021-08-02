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
          <span>
            TVL
          </span>
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
          <span>
            Daily Volume
          </span>
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
          <span>
            Daily Transaction
          </span>
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
          <span>
            Daily Reward
          </span>
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
          <span>
            Total supply
          </span>
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
          <span>
            LP Providers
          </span>
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
          <span>
            Pairs listed
          </span>
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
          <span>
            Max Supply
          </span>
        </Tooltip>
      </Trans>),
    currency: 'QPSP',
  },
];
