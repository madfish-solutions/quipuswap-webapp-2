import { FC, ReactNode } from 'react';

import { StatusLabel } from '@shared/components/status-label';
import { FarmIcon, HomeIcon, LiquidityIcon, MoreIcon, StableswapIcon, SwapIcon, VotingIcon } from '@shared/svg';
import { ActiveStatus } from '@shared/types';
import { Trans } from '@translation';

import styles from './navigation.module.scss';

interface LinkInterface {
  id: number;
  to?: string;
  label: ReactNode;
  target?: string;
  Icon?: FC<{ className?: string; id?: string }>;
  status?: ReactNode;
}

interface NavigationDataProps extends LinkInterface {
  links?: LinkInterface[];
}

export const NAVIGATION_DATA: NavigationDataProps[] = [
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
    to: '/liquidity',
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
    to: '/stableswap',
    label: <Trans ns="common">Stableswap</Trans>,
    Icon: StableswapIcon,
    status: <StatusLabel status={ActiveStatus.ACTIVE} filled label="new" className={styles.navigationStatus} />
  },
  {
    id: 5,
    to: '/farming',
    label: <Trans ns="common">Farming</Trans>,
    Icon: FarmIcon
  },
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
