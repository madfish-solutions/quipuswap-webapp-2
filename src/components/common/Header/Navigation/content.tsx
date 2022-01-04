import React from 'react';

import { HomeIcon, VotingIcon, LiquidityIcon, SwapIconSidebar, MoreIcon } from '@quipuswap/ui-kit';
import { Trans } from 'next-i18next';

import { networksDefaultTokens, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenSlug } from '@utils/helpers';
import { QSMainNet } from '@utils/types';

interface LinkInterface {
  id: number;
  href?: string;
  as?: string;
  label: React.ReactNode;
  Icon?: React.FC<{ className?: string; id?: string }>;
}

interface NavigationDataProps extends LinkInterface {
  links?: LinkInterface[];
}

export const makeNavigationData = (network: QSMainNet): NavigationDataProps[] => [
  {
    id: 0,
    href: '/',
    label: <Trans ns="common">Home</Trans>,
    Icon: HomeIcon
  },
  {
    id: 1,
    href: '/swap/[from-to]',
    as: `/swap/${getTokenSlug(TEZOS_TOKEN)}-${getTokenSlug(networksDefaultTokens[network])}`,
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIconSidebar
  },
  {
    id: 2,
    href: '/liquidity/[method]/[from-to]',
    as: `/liquidity/add/${getTokenSlug(TEZOS_TOKEN)}-${getTokenSlug(networksDefaultTokens[network])}`,
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon
  },
  {
    id: 3,
    href: '/voting/[method]/[from-to]',
    as: '/voting/vote/TEZ-QUIPU',
    label: <Trans ns="common">Voting</Trans>,
    Icon: VotingIcon
  },
  // {
  //   id: 4,
  //   href: '/stake',
  //   label: <Trans ns="common">Stake</Trans>,
  //   Icon: StakeIcon,
  // },
  // {
  //   id: 5,
  //   href: '/farm',
  //   label: <Trans ns="common">Farm</Trans>,
  //   Icon: FarmIcon,
  // },
  // {
  //   id: 6,
  //   href: '/portfolio',
  //   label: <Trans ns="common">Portfolio</Trans>,
  //   Icon: PortfolioIcon,
  // },
  // {
  //   id: 7,
  //   href: '/governance',
  //   label: <Trans ns="common">Governance</Trans>,
  //   Icon: GovernanceIcon,
  // },
  {
    id: 7,
    label: <Trans ns="common">More</Trans>,
    Icon: MoreIcon,
    links: [
      {
        id: 0,
        href: 'https://analytics.quipuswap.com/',
        label: 'Analytics'
      },
      {
        id: 1,
        href: 'https://story.madfish.solutions/category/quipuswap/',
        label: 'About'
      },
      {
        id: 2,
        href: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
        label: 'Audit'
      },
      {
        id: 3,
        href: 'https://madfish.crunch.help/quipu-swap',
        label: 'Help'
      },
      {
        id: 4,
        href: 'https://docs.quipuswap.com/',
        label: 'Docs'
      },
      {
        id: 5,
        href: 'https://story.madfish.solutions/',
        label: 'Blog'
      },
      {
        id: 6,
        href: '/terms-of-service',
        label: 'Terms of Usage'
      },
      {
        id: 7,
        href: '/privacy-policy',
        label: 'Privacy Policy'
      }
    ]
  }
];
