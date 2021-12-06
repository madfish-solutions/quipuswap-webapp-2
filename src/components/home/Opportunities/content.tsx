import React, { ReactNode } from 'react';
import { Trans } from 'next-i18next';
import { Earn, Farm, Trade } from '@quipuswap/ui-kit';

type OpportunitiesCardsDataType = {
  id: number
  Icon: React.FC<{ className?: string }>
  title: ReactNode
  description: ReactNode
  button: {
    label: ReactNode
    href?: string
    disabled?: boolean
    external?: boolean
  }
};

export const OpportunitiesCardsData: OpportunitiesCardsDataType[] = [
  {
    id: 0,
    Icon: Trade,
    title: <Trans ns="home">Trade Any Tezos-based token</Trans>,
    description: <Trans ns="home">Swap any FA1.2-FA2 tokens on the QuipuSwap DEX instantly. We have more than 150 trading pairs available and low fees.</Trans>,
    button: {
      label: <Trans ns="home">Start Trading</Trans>,
      href: '/swap/TEZ-QUIPU',
    },
  },
  {
    id: 1,
    Icon: Farm,
    title: <Trans ns="home">Farm tokens with QuipuSwap</Trans>,
    description: <Trans ns="home">You may earn extra rewards by participating in our farm projects. Add liquidity to the pool, stake your Liquidity tokens in our farms, and earn rewards.</Trans>,
    button: {
      label: <Trans ns="home">Coming soon</Trans>,
      disabled: true,
    },
  },
  {
    id: 2,
    Icon: Earn,
    title: <Trans ns="home">Earn by providing Liquidity</Trans>,
    description: <Trans ns="home">By adding your tokens to the Liquidity pool, you will earn a part of the 0.3% fee charged from each trade operation in this pool as well as baking rewards.</Trans>,
    button: {
      label: <Trans ns="home">Add Liquidity</Trans>,
      href: '/liquidity/add/TEZ-QUIPU',
    },
  },
];
