import { FC, ReactNode } from 'react';

import { Trans } from 'next-i18next';

import { FarmIcon, HomeIcon, LiquidityIcon, MoreIcon, SwapIcon, VotingIcon } from '../../../svg';

interface LinkInterface {
  id: number;
  to?: string;
  label: ReactNode;
  target?: string;
  Icon?: FC<{ className?: string; id?: string }>;
}

interface NavigationDataProps extends LinkInterface {
  links?: LinkInterface[];
}

export const navigationData: NavigationDataProps[] = [
  {
    id: 0,
    to: '/',
    label: <Trans ns="common">Home</Trans>,
    Icon: HomeIcon
  },
  {
    id: 1,
    to: '/swap',
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIcon
  },
  {
    id: 2,
    to: '/liquidity/add/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0',
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon
  },
  {
    id: 3,
    to: '/voting',
    label: <Trans ns="common">Voting</Trans>,
    Icon: VotingIcon
  },
  {
    id: 4,
    to: '/farming',
    label: <Trans ns="common">Farming</Trans>,
    Icon: FarmIcon
  },
  // {
  //   id: 5,
  //   to: '/farm',
  //   label: <Trans ns="common">Farm</Trans>,
  //   Icon: FarmIcon,
  // },
  // {
  //   id: 6,
  //   to: '/portfolio',
  //   label: <Trans ns="common">Portfolio</Trans>,
  //   Icon: PortfolioIcon,
  // },
  // {
  //   id: 7,
  //   to: '/governance',
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
        to: 'https://analytics.quipuswap.com/',
        label: 'Analytics',
        target: '_blank'
      },
      {
        id: 1,
        to: 'https://story.madfish.solutions/category/quipuswap/',
        label: 'About',
        target: '_blank'
      },
      {
        id: 2,
        to: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
        label: 'Audit',
        target: '_blank'
      },
      {
        id: 3,
        to: 'https://madfish.crunch.help/quipu-swap',
        label: 'Help',
        target: '_blank'
      },
      {
        id: 4,
        to: 'https://docs.quipuswap.com/',
        label: 'Docs',
        target: '_blank'
      },
      {
        id: 5,
        to: 'https://story.madfish.solutions/',
        label: 'Blog',
        target: '_blank'
      },

      {
        id: 8,
        to: 'https://madfish.canny.io/quipuswap-feature-requests',
        label: 'Feedback',
        target: '_blank'
      },
      {
        id: 6,
        to: '/terms-of-service',
        label: 'Terms of Usage'
      },
      {
        id: 7,
        to: '/privacy-policy',
        label: 'Privacy Policy'
      }
    ]
  }
];
