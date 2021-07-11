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

export const Navigation: Array<{
  id: number
  href: string
  label: React.ReactNode
  external?: boolean
  Icon: React.FC<IconProps>
}> = [
  {
    id: 0,
    href: 'https://quipuswap-landing.vercel.app/',
    label: <Trans ns="common">Home</Trans>,
    external: true,
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
];
