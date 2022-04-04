import React from 'react';

import { HomeIcon, VotingIcon, LiquidityIcon, SwapIconSidebar, MoreIcon } from '@quipuswap/ui-kit';
import { Trans } from 'next-i18next';

import { FarmIcon } from '@components/svg/Sidebar/FarmIcon';
import { ActiveStatus } from '@interfaces/active-statuts-enum';

import { StatusLabel } from '../../../ui/status-label';
import s from './Navigation.module.sass';

interface LinkInterface {
  id: number;
  href?: string;
  matchHrefs?: string[];
  as?: string;
  label: React.ReactNode;
  target?: string;
  Icon?: React.FC<{ className?: string; id?: string }>;
  status?: React.ReactNode;
}

interface NavigationDataProps extends LinkInterface {
  links?: LinkInterface[];
}

export const navigationData: NavigationDataProps[] = [
  {
    id: 0,
    href: '/',
    label: <Trans ns="common">Home</Trans>,
    Icon: HomeIcon
  },
  {
    id: 1,
    href: '/swap',
    matchHrefs: ['/swap', '/send'],
    as: `/swap`,
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIconSidebar
  },
  {
    id: 2,
    href: '/liquidity/[method]',
    as: `/liquidity/add`,
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon
  },
  {
    id: 3,
    href: '/voting/[method]',
    as: `/voting/vote`,
    label: <Trans ns="common">Voting</Trans>,
    Icon: VotingIcon
  },
  {
    id: 4,
    href: '/farming',
    as: `/farming`,
    label: <Trans ns="common">Farming</Trans>,
    Icon: FarmIcon,
    status: <StatusLabel status={ActiveStatus.ACTIVE} filled label="new" className={s.navigationStatus} />
  },
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
        label: 'Analytics',
        target: '_blank'
      },
      {
        id: 1,
        href: 'https://story.madfish.solutions/category/quipuswap/',
        label: 'About',
        target: '_blank'
      },
      {
        id: 2,
        href: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
        label: 'Audit',
        target: '_blank'
      },
      {
        id: 3,
        href: 'https://madfish.crunch.help/quipu-swap',
        label: 'Help',
        target: '_blank'
      },
      {
        id: 4,
        href: 'https://docs.quipuswap.com/',
        label: 'Docs',
        target: '_blank'
      },
      {
        id: 5,
        href: 'https://story.madfish.solutions/',
        label: 'Blog',
        target: '_blank'
      },

      {
        id: 8,
        href: 'https://madfish.canny.io/quipuswap-feature-requests',
        label: 'Feedback',
        target: '_blank'
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
