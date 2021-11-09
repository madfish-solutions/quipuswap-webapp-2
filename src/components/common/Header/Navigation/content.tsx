import React from 'react';
import { Trans } from 'next-i18next';

import { GovernanceIcon } from '@components/svg/Sidebar/GovernanceIcon';
import { PortfolioIcon } from '@components/svg/Sidebar/PortfolioIcon';
import { FarmIcon } from '@components/svg/Sidebar/FarmIcon';
import { VotingIcon } from '@components/svg/Sidebar/VotingIcon';
import { LiquidityIcon } from '@components/svg/Sidebar/LiquidityIcon';
import { StakeIcon } from '@components/svg/Sidebar/StakeIcon';
import { SwapIcon } from '@components/svg/Sidebar/SwapIcon';
import { HomeIcon } from '@components/svg/Sidebar/HomeIcon';
import MoreIcon from '@icons/MoreIcon.svg';

type NavigationDataProps = {
  id: number
  href?: string
  as?: string
  label: React.ReactNode
  Icon: React.FC<{ className?: string, id?: string }>
  links?: {
    id: number
    href: string
    label: string
  }[]
}[];

export const NavigationData: NavigationDataProps = [
  {
    id: 0,
    href: '/',
    label: <Trans ns="common">Home</Trans>,
    Icon: HomeIcon,
  },
  {
    id: 1,
    href: '/swap',
    as: '/swap/TEZ-QUIPU',
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIcon,
  },
  {
    id: 2,
    href: '/liquidity',
    as: '/liquidity/add/TEZ-QUIPU',
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon,
  },
  {
    id: 3,
    href: '/voting',
    as: '/voting/vote/TEZ-QUIPU',
    label: <Trans ns="common">Voting</Trans>,
    Icon: VotingIcon,
  },
  {
    id: 4,
    href: '/stake',
    label: <Trans ns="common">Stake</Trans>,
    Icon: StakeIcon,
  },
  {
    id: 5,
    href: '/farm',
    label: <Trans ns="common">Farm</Trans>,
    Icon: FarmIcon,
  },
  {
    id: 6,
    href: '/portfolio',
    label: <Trans ns="common">Portfolio</Trans>,
    Icon: PortfolioIcon,
  },
  {
    id: 7,
    href: '/governance',
    label: <Trans ns="common">Governance</Trans>,
    Icon: GovernanceIcon,
  },
  {
    id: 7,
    label: <Trans ns="common">More</Trans>,
    Icon: MoreIcon,
    links: [
      {
        id: 0,
        href: 'https://www.google.com',
        label: 'Analytics',
      },
      {
        id: 1,
        href: 'https://www.google.com',
        label: 'About',
      },
      {
        id: 2,
        href: 'https://www.google.com',
        label: 'Audit',
      },
      {
        id: 3,
        href: 'https://www.google.com',
        label: 'Help',
      },
      {
        id: 4,
        href: 'https://www.google.com',
        label: 'Docs',
      },
      {
        id: 5,
        href: 'https://www.google.com',
        label: 'Blog',
      },
      {
        id: 6,
        href: 'https://www.google.com',
        label: 'Terms of Usage',
      },
      {
        id: 7,
        href: 'https://www.google.com',
        label: 'Privacy Policy',
      },
    ],
  },
];
