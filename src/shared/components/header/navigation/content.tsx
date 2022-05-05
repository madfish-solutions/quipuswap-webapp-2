import { FC, ReactNode } from 'react';

import { AppRootRoutes } from '@app.router';
import { StatusLabel } from '@shared/components/status-label';
import {
  AnalyticsIcon,
  FarmIcon,
  FeedbackIcon,
  HomeIcon,
  LiquidityIcon,
  MoreIcon,
  StableswapIcon,
  SwapIcon,
  GameIcon
} from '@shared/svg';
import { ActiveStatus } from '@shared/types';
import { Trans } from '@translation';

import { isProd } from '../../../helpers';
import styles from './navigation.module.scss';

interface LinkInterface {
  id: string;
  to?: string;
  label: ReactNode;
  target?: string;
  Icon?: FC<{ className?: string; id?: string }>;
  status?: ReactNode;
  hide?: boolean;
}

export interface NavigationDataProps extends LinkInterface {
  links?: LinkInterface[];
}

export const isShow = (nav: NavigationDataProps) => !nav.hide;

export const NAVIGATION_DATA: NavigationDataProps[] = [
  {
    id: 'Home',
    to: AppRootRoutes.Root,
    label: <Trans ns="common">Home</Trans>,
    Icon: HomeIcon
  },
  {
    id: 'Swap',
    to: AppRootRoutes.Swap,
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIcon
  },
  {
    id: 'Liquidity',
    to: AppRootRoutes.Liquidity,
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon
  },
  {
    id: 'Stableswap',
    to: AppRootRoutes.Stableswap,
    label: <Trans ns="common">Stableswap</Trans>,
    Icon: StableswapIcon,
    status: <StatusLabel status={ActiveStatus.ACTIVE} filled label="NEW" className={styles.navigationStatus} />,
    hide: isProd()
  },
  {
    id: 'Farming',
    to: AppRootRoutes.Farming,
    label: <Trans ns="common">Farming</Trans>,
    Icon: FarmIcon
  },
  {
    id: 'Coinflip',
    to: AppRootRoutes.Coinflip,
    label: <Trans ns="common">Coinflip</Trans>, ///
    Icon: GameIcon
  },
  {
    id: 'Analytics',
    to: 'https://analytics.quipuswap.com/',
    label: <Trans ns="common">Analytics</Trans>,
    Icon: AnalyticsIcon,
    target: '_blank'
  },
  {
    id: 'Feedback',
    to: 'https://madfish.canny.io/quipuswap-feature-requests',
    label: <Trans ns="common">Feedback</Trans>,
    Icon: FeedbackIcon,
    target: '_blank'
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
    id: 'More',
    label: <Trans ns="common">More</Trans>,
    Icon: MoreIcon,
    links: [
      {
        id: 'More_Voting',
        to: AppRootRoutes.Voting,
        label: <Trans ns="common">Voting</Trans>
      },
      {
        id: 'More_About',
        to: 'https://story.madfish.solutions/category/quipuswap/',
        label: 'About',
        target: '_blank'
      },
      {
        id: 'More_Audit',
        to: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
        label: 'Audit',
        target: '_blank'
      },
      {
        id: 'More_Help',
        to: 'https://madfish.crunch.help/quipu-swap',
        label: 'Help',
        target: '_blank'
      },
      {
        id: 'More_Docs',
        to: 'https://docs.quipuswap.com/',
        label: 'Docs',
        target: '_blank'
      },
      {
        id: 'More_Blog',
        to: 'https://story.madfish.solutions/',
        label: 'Blog',
        target: '_blank'
      },

      {
        id: 'More_TermsOfService',
        to: AppRootRoutes.TermsOfService,
        label: 'Terms of Usage'
      },
      {
        id: 'More_PrivacyPolicy',
        to: AppRootRoutes.PrivacyPolicy,
        label: 'Privacy Policy'
      }
    ]
  }
];
