import { FC, ReactNode } from 'react';

import { StatusLabel } from '@shared/components/status-label';
import { FarmIcon, HomeIcon, LiquidityIcon, MoreIcon, SwapIcon, VotingIcon } from '@shared/svg';
import { ActiveStatus } from '@shared/types';
import { Trans } from '@translation';

import styles from './navigation.module.scss';

interface LinkInterface {
  id: number;
  to?: string;
  label: ReactNode;
  target?: string;
  Icon?: FC<{ className?: string; id?: string }>;
  testId?: string;
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
    Icon: HomeIcon,
    testId: 'sHome'
  },
  {
    id: 1,
    to: '/swap',
    label: <Trans ns="common">Swap</Trans>,
    Icon: SwapIcon,
    testId: 'sSwap'
  },
  {
    id: 2,
    to: '/liquidity',
    label: <Trans ns="common">Liquidity</Trans>,
    Icon: LiquidityIcon,
    testId: 'sLiquidity'
  },
  {
    id: 3,
    to: '/voting',
    label: <Trans ns="common">Voting</Trans>,
    Icon: VotingIcon,
    testId: 'sVoting'
  },
  {
    id: 4,
    to: '/farming',
    label: <Trans ns="common">Farming</Trans>,
    Icon: FarmIcon,
    testId: 'sFarming',
    status: <StatusLabel status={ActiveStatus.ACTIVE} filled label="new" className={styles.navigationStatus} />
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
    testId: 'smore',
    links: [
      {
        id: 0,
        to: 'https://analytics.quipuswap.com/',
        label: 'Analytics',
        target: '_blank',
        testId: 'sAnalytics'
      },
      {
        id: 1,
        to: 'https://story.madfish.solutions/category/quipuswap/',
        label: 'About',
        target: '_blank',
        testId: 'sAbout'
      },
      {
        id: 2,
        to: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
        label: 'Audit',
        target: '_blank',
        testId: 'sAudit'
      },
      {
        id: 3,
        to: 'https://madfish.crunch.help/quipu-swap',
        label: 'Help',
        target: '_blank',
        testId: 'sHelp'
      },
      {
        id: 4,
        to: 'https://docs.quipuswap.com/',
        label: 'Docs',
        target: '_blank',
        testId: 'sDocs'
      },
      {
        id: 5,
        to: 'https://story.madfish.solutions/',
        label: 'Blog',
        target: '_blank',
        testId: 'sBlog'
      },

      {
        id: 8,
        to: 'https://madfish.canny.io/quipuswap-feature-requests',
        label: 'Feedback',
        target: '_blank',
        testId: 'sFeedback'
      },
      {
        id: 6,
        to: '/terms-of-service',
        label: 'Terms of Usage',
        testId: 'sTermsOfUsage'
      },
      {
        id: 7,
        to: '/privacy-policy',
        label: 'Privacy Policy',
        testId: 'sPrivacyPolicy'
      }
    ]
  }
];
