import { FC, ReactNode, useMemo } from 'react';

import { DexTypeEnum } from 'swap-router-sdk';

import { TZKT_EXPLORER_URL } from '@config/environment';
import { Button, TokensLogos } from '@shared/components';
import { DexTwoCategoryIcon, StableCategory, V3Category } from '@shared/svg/categories';

import { DexPool } from '../../types';
import s from './pool-button.module.scss';

interface PoolButtonProps {
  pool: DexPool;
}

const dexTypesIcons: Partial<Record<DexTypeEnum, ReactNode>> = {
  [DexTypeEnum.QuipuSwapCurveLike]: <StableCategory />,
  [DexTypeEnum.QuipuSwap20]: <DexTwoCategoryIcon />,
  [DexTypeEnum.QuipuSwapV3]: <V3Category />
};

export const PoolButton: FC<PoolButtonProps> = ({ pool }) => {
  const tokens = useMemo(() => pool.tokensPools.map(({ token }) => token), [pool]);

  return (
    <Button textClassName={s.content} external href={`${TZKT_EXPLORER_URL}/${pool.dexAddress}`} theme="quaternary">
      <TokensLogos tokens={tokens} />
      {dexTypesIcons[pool.dexType]}
    </Button>
  );
};
