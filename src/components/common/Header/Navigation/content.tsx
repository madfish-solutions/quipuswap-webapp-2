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
  label: React.ReactNode
  Icon: React.FC<{ className?: string, id?: string }>
  links?: {
    id: number
    href: string
    label: string
    notExternal?:boolean
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
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIcon,
  },
  {
    id: 2,
    href: '/liquidity',
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon,
  },
  {
    id: 3,
    href: '/voting',
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
        href: 'https://analytics.quipuswap.com/',
        label: 'Analytics',
      },
      {
        id: 1,
        href: 'https://story.madfish.solutions/category/quipuswap/',
        label: 'About',
      },
      {
        id: 2,
        href: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
        label: 'Audit',
      },
      {
        id: 3,
        href: 'https://madfish.crunch.help/quipu-swap',
        label: 'Help',
      },
      {
        id: 4,
        href: 'https://docs.quipuswap.com/',
        label: 'Docs',
      },
      {
        id: 5,
        href: 'https://story.madfish.solutions/',
        label: 'Blog',
      },
      {
        id: 6,
        href: '/terms-of-service',
        label: 'Terms of Service',
        notExternal: true,
      },
      {
        id: 7,
        href: '/privacy-policy',
        label: 'Privacy Policy',
        notExternal: true,
      },
    ],
  },
];
