import { FC, ReactNode } from 'react';

import { AppRootRoutes } from '@app.router';
import { ExternalLinks } from '@config/external-links';
// It's important to import entities from modules directly from files
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { LabelComponent } from '@shared/components/label-component';
import {
  AllBridgeIcon,
  AnalyticsIcon,
  FarmIcon,
  FeedbackIcon,
  GameIcon,
  HomeIcon,
  LiquidityIcon,
  MoreIcon,
  StableswapIcon,
  SwapIcon
} from '@shared/svg';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

import { getId } from '../../../helpers';
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
    Icon: LiquidityIcon,
    status: (
      <LabelComponent status={ActiveStatus.ACTIVE} filled label={newLabelText} className={styles.navigationStatus} />
    )
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
    Icon: GameIcon
  },
  {
    id: 'Stableswap_Dividends',
    to: `${AppRootRoutes.Stableswap}${StableswapRoutes.dividends}`,
    label: i18n.t('common|Dividends'),
    Icon: StableswapIcon
  },
  {
    id: 'Analytics',
    to: ExternalLinks.QuipuswapAnalyticsUrl,
    label: i18n.t('common|Analytics'),
    Icon: AnalyticsIcon,
    target: '_blank'
  },
  {
    id: 'Allbridge',
    to: ExternalLinks.AllbridgeUrl,
    label: i18n.t('common|Allbridge'),
    Icon: AllBridgeIcon,
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
        to: ExternalLinks.AboutQuipuSwapUrl,
        label: i18n.t('common|About'),
        target: '_blank'
      },
      {
        id: 'More_Audit',
        to: ExternalLinks.AboutAuditUrl,
        label: i18n.t('common|Audit'),
        target: '_blank'
      },
      {
        id: 'More_Help',
        to: ExternalLinks.HelpUrl,
        label: i18n.t('common|Help'),
        target: '_blank'
      },
      {
        id: 'Feedback',
        to: ExternalLinks.FeedbackUrl,
        label: i18n.t('common|Feedback'),
        Icon: FeedbackIcon,
        target: '_blank'
      },
      {
        id: 'More_Docs',
        to: ExternalLinks.DocsUrl,
        label: i18n.t('common|Docs'),
        target: '_blank'
      },
      {
        id: 'More_Blog',
        to: ExternalLinks.BlogUrl,
        label: i18n.t('common|Blog'),
        target: '_blank'
      },

      {
        id: 'More_TermsOfService',
        to: AppRootRoutes.TermsOfService,
        label: i18n.t('common|Terms of Usage')
      },
      {
        id: 'More_PrivacyPolicy',
        to: AppRootRoutes.PrivacyPolicy,
        label: i18n.t('common|Privacy Policy')
      }
    ]
  }
];

export const DEFAULT_OPENED_MENU: Record<string, boolean> = NAVIGATION_DATA.filter(
  menu => isMenuItem(menu) && menu.opened
)
  .map(getId)
  .reduce(
    (acc, id) => ({
      ...acc,
      [id]: true
    }),
    {}
  );
