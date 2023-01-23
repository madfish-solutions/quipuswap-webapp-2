import { FC, ReactElement, useMemo } from 'react';

import { DexTypeEnum } from 'swap-router-sdk';

import { TZKT_EXPLORER_URL } from '@config/environment';
import { Button, TokensLogos, Tooltip } from '@shared/components';
import { getSymbolsString } from '@shared/helpers';
import { DexTwoCategoryIcon, StableCategory, V3Category } from '@shared/svg/categories';

import { DexPool } from '../../types';
import s from './pool-button.module.scss';

interface PoolButtonProps {
  pool: DexPool;
}

const dexTypesIcons: Partial<Record<DexTypeEnum, ReactElement>> = {
  [DexTypeEnum.QuipuSwapCurveLike]: <StableCategory size={16} stroke="#505565" />,
  [DexTypeEnum.QuipuSwap20]: <DexTwoCategoryIcon size={16} fill="#505565" />,
  [DexTypeEnum.QuipuSwapV3]: <V3Category size={16} fill="#505565" />
};

const poolTypesNames: Partial<Record<DexTypeEnum, string>> = {
  [DexTypeEnum.QuipuSwap]: 'QuipuSwap V1',
  [DexTypeEnum.QuipuSwapTokenToTokenDex]: 'QuipuSwap V1',
  [DexTypeEnum.QuipuSwapCurveLike]: 'Stable',
  [DexTypeEnum.QuipuSwap20]: 'QuipuSwap V2',
  [DexTypeEnum.QuipuSwapV3]: 'QuipuSwap V3'
};

export const PoolButton: FC<PoolButtonProps> = ({ pool }) => {
  const tokens = useMemo(() => pool.tokensPools.map(({ token }) => token), [pool]);
  const dexTypeIcon = dexTypesIcons[pool.dexType];

  return (
    <div className={s.content}>
      <Button textClassName={s.content} external href={`${TZKT_EXPLORER_URL}/${pool.dexAddress}`} theme="quaternary">
        <TokensLogos tokens={tokens} />
      </Button>
      {dexTypeIcon && (
        <Tooltip
          content={
            <>
              <p className={s.tooltipText}>{poolTypesNames[pool.dexType]} pool:</p>
              <p className={s.tooltipText}>{getSymbolsString(tokens)}</p>
            </>
          }
          placement="bottom"
        >
          <div className={s.dexTypeIconWrapper}>{dexTypeIcon}</div>
        </Tooltip>
      )}
    </div>
  );
};
