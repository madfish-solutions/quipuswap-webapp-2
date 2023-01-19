import { FC, ReactNode } from 'react';

import { AppRootRoutes } from '@app.router';
import { Earn, Farm, Trade } from '@shared/svg';
import { i18n } from '@translation';

interface OpportunitiesCardsDataType {
  id: number;
  Icon: FC<{ className?: string }>;
  title: ReactNode;
  description: ReactNode;
  button: {
    label: ReactNode;
    href?: string;
    disabled?: boolean;
  };
}

export const OpportunitiesCardsData: OpportunitiesCardsDataType[] = [
  {
    id: 0,
    Icon: Trade,
    title: i18n.t('home|Trade Any Tezos-based token'),
    description: i18n.t(
      'home|Swap any FA1.2-FA2 tokens on the QuipuSwap DEX instantly. We have more than 150 trading pairs available and low fees.'
    ),
    button: {
      label: i18n.t('home|Start Trading'),
      href: AppRootRoutes.Swap
    }
  },
  {
    id: 1,
    Icon: Farm,
    title: i18n.t('home|Farm tokens with QuipuSwap'),
    description: i18n.t(
      'home|You may earn extra rewards by participating in our farm projects. Add liquidity to the pool, stake your Liquidity tokens in our farms, and earn rewards.'
    ),
    button: {
      label: i18n.t('home|Start Farming'),
      href: AppRootRoutes.Farming
    }
  },
  {
    id: 2,
    Icon: Earn,
    title: i18n.t('home|Earn by providing Liquidity'),
    description: i18n.t(
      'home|By adding your tokens to the Liquidity pool, you will earn a part of the 0.3% fee charged from each trade operation in this pool as well as baking rewards.'
    ),
    button: {
      label: i18n.t('home|Add Liquidity'),
      href: AppRootRoutes.Liquidity
    }
  }
];
