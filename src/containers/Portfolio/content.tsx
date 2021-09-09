import React from 'react';
import { Trans } from 'next-i18next';

type PortfolioDataProps = {
  id: number
  volume: string
  label: React.ReactNode
  currency?: string
}[];

export const PortfolioData: PortfolioDataProps = [
  {
    id: 0,
    volume: '8888888888888',
    currency: '$',
    label: (
      <Trans ns="portfolio">
        TVL
      </Trans>),
  },
  {
    id: 1,
    volume: '44',
    label: (
      <Trans ns="portfolio">
        Token Count
      </Trans>),
  },
  {
    id: 2,
    volume: '888888888888888',
    currency: 'QPSP',
    label: (
      <Trans ns="portfolio">
        Daily Transaction
      </Trans>),
  },
  {
    id: 3,
    volume: '44',
    label: (
      <Trans ns="portfolio">
        Pools Invested
      </Trans>),
  },
  {
    id: 4,
    volume: '888888888888',
    label: (
      <Trans ns="portfolio">
        Total supply
      </Trans>),
    currency: '$',
  },
  {
    id: 5,
    volume: '44',
    label: (
      <Trans ns="portfolio">
        Farms Joined
      </Trans>),
  },
];
