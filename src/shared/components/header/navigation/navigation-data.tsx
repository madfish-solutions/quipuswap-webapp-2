import { FC, ReactNode } from 'react';

import { AppRootRoutes } from '@app.router';
// It's important to import entities from modules directly from files
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
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
  GameIcon,
  NewLiquidityIcon
} from '@shared/svg';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

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

const newLabelText = i18n.t('common|NEW');

export const NAVIGATION_DATA: NavigationDataProps[] = [
  {
    id: 'Home',
    to: AppRootRoutes.Root,
    label: i18n.t('common|Home'),
    Icon: HomeIcon
  },
  {
    id: 'Swap',
    to: AppRootRoutes.Swap,
    label: i18n.t('common|Swap'),
    Icon: SwapIcon
  },
  {
    id: 'Liquidity',
    to: AppRootRoutes.Liquidity,
    label: i18n.t('common|Liquidity'),
    Icon: LiquidityIcon
  },
  {
    id: 'NewLiquidity',
    to: AppRootRoutes.NewLiquidity,
    label: i18n.t('newLiquidity|newLiquidity'),
    Icon: NewLiquidityIcon,
    hide: isProd()
  },
  {
    id: 'Farming',
    to: AppRootRoutes.Farming,
    label: i18n.t('common|Farming'),
    Icon: FarmIcon
  },
  {
    id: 'Coinflip',
    to: AppRootRoutes.Coinflip,
    label: i18n.t('common|Game'),
    Icon: GameIcon,
    hide: isProd()
  },
  {
    id: 'Stableswap',
    to: AppRootRoutes.Stableswap,
    label: i18n.t('common|Stableswap'),
    Icon: StableswapIcon,
    opened: true,
    links: [
      {
        id: 'Stableswap_Dividends',
        to: `${AppRootRoutes.Stableswap}${StableswapRoutes.dividends}`,
        label: i18n.t('common|Dividends'),
        status: (
          <StatusLabel status={ActiveStatus.ACTIVE} filled label={newLabelText} className={styles.navigationStatus} />
        )
      },
      {
        id: 'Stableswap_Liquidity',
        to: `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}`,
        label: i18n.t('common|Liquidity'),
        status: (
          <StatusLabel status={ActiveStatus.ACTIVE} filled label={newLabelText} className={styles.navigationStatus} />
        )
      }
    ]
  },
  {
    id: 'Analytics',
    to: 'https://analytics.quipuswap.com/',
    label: i18n.t('common|Analytics'),
    Icon: AnalyticsIcon,
    target: '_blank'
  },
  {
    id: 'Feedback',
    to: 'https://madfish.canny.io/quipuswap-feature-requests',
    label: i18n.t('common|Feedback'),
    Icon: FeedbackIcon,
    target: '_blank'
  },
  // {
  //   id: 6,
  //   to: '/portfolio',
  //   label:i18n.t("common|Portfolio"),
  //   Icon: PortfolioIcon,
  // },
  // {
  //   id: 7,
  //   to: '/governance',
  //   label: i18n.t("common|Governance"),
  //   Icon: GovernanceIcon,
  // },
  {
    id: 'More',
    label: i18n.t('common|More'),
    Icon: MoreIcon,
    to: '',
    links: [
      {
        id: 'More_Voting',
        to: AppRootRoutes.Voting,
        label: i18n.t('common|Voting')
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
