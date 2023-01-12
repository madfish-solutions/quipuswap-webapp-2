import React, { FC, useMemo } from 'react';

import { DexTypeEnum } from 'swap-router-sdk';

import { /* HIDE_ANALYTICS, */ QUIPUSWAP_ANALYTICS_PAIRS } from '@config/config';
import { Button, TokensLogos } from '@shared/components';
import { isExist } from '@shared/helpers';
import { DexTwoCategoryIcon, StableCategory, V3Category } from '@shared/svg/categories';

import { DexPool } from '../../types';
import s from './pool-button.module.scss';

interface PoolButtonProps {
  pool: DexPool;
}

const dexTypesIcons: Partial<Record<DexTypeEnum, React.ReactNode>> = {
  [DexTypeEnum.QuipuSwapCurveLike]: <StableCategory />,
  [DexTypeEnum.QuipuSwap20]: <DexTwoCategoryIcon />,
  [DexTypeEnum.QuipuSwapV3]: <V3Category />
};

export const PoolButton: FC<PoolButtonProps> = ({ pool }) => {
  const link = useMemo(() => {
    /* if (HIDE_ANALYTICS) {
      return null;
    } */

    if (pool.dexType === DexTypeEnum.QuipuSwap) {
      return `${QUIPUSWAP_ANALYTICS_PAIRS}/${pool.dexAddress}`;
    }

    return null;
  }, [pool]);

  const tokens = useMemo(() => [pool.token1, pool.token2, pool.token3, pool.token4].filter(isExist), [pool]);

  if (link) {
    return (
      <Button className={s.root} external href={link} theme="quaternary">
        <TokensLogos tokens={tokens} />
        {dexTypesIcons[pool.dexType]}
      </Button>
    );
  }

  return (
    <span className={s.root}>
      <TokensLogos tokens={tokens} />
      {dexTypesIcons[pool.dexType]}
    </span>
  );
};
