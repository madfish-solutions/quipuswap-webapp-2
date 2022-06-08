import { FC, ReactNode } from 'react';

import { AppRootRoutes } from '@app.router';
import { StableswapRoutes } from '@modules/stableswap';
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
import { i18n, Trans } from '@translation';

import { isProd } from '../../../helpers';
import styles from './navigation.module.scss';

interface LinkInterface {
  id: string;
  label: ReactNode;
  target?: string;
  Icon?: FC<{ className?: string; id?: string }>;
  status?: ReactNode;
  hide?: boolean;
  to: string;
}

export interface LinkMenuInterface extends LinkInterface {
  links: LinkInterface[];
  opened?: boolean;
}

export type NavigationDataProps = LinkInterface | LinkMenuInterface;

export const isShow = (nav: NavigationDataProps) => !nav.hide;
export const isMenuItem = (nav: NavigationDataProps): nav is LinkMenuInterface => 'links' in nav;
export const isSingleItem = (nav: NavigationDataProps): nav is LinkInterface => !isMenuItem(nav);

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
    id: 'Farming',
    to: AppRootRoutes.Farming,
    label: <Trans ns="common">Farming</Trans>,
    Icon: FarmIcon
  },
  {
    id: 'Coinflip',
    to: AppRootRoutes.Coinflip,
    label: <Trans ns="common">Game</Trans>,
    Icon: GameIcon,
    hide: isProd()
  },
  {
    id: 'Stableswap',
    to: AppRootRoutes.Stableswap,
    label: <Trans ns="common">Stableswap</Trans>,
    Icon: StableswapIcon,
    hide: isProd(),
    opened: true,
    links: [
      {
        id: 'Stableswap_Farm',
        to: `${AppRootRoutes.Stableswap}${StableswapRoutes.farming}`,
        label: <Trans ns="common">Farm</Trans>,
        status: (
          <StatusLabel
            status={ActiveStatus.ACTIVE}
            filled
            label={i18n.t('common|NEW')}
            className={styles.navigationStatus}
          />
        )
      },
      {
        id: 'Stableswap_Liquidity',
        to: `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`,
        label: <Trans ns="common">Liquidity</Trans>,
        status: (
          <StatusLabel
            status={ActiveStatus.ACTIVE}
            filled
            label={i18n.t('common|NEW')}
            className={styles.navigationStatus}
          />
        )
      }
    ]
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
    to: '',
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

export const DEFAULT_OPENED_MENU: Record<string, boolean> = NAVIGATION_DATA.filter(
  menu => isMenuItem(menu) && menu.opened
)
  .map(({ id }) => id)
  .reduce(
    (acc, id) => ({
      ...acc,
      [id]: true
    }),
    {}
  );
