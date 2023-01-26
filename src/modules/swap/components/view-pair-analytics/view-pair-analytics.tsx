import { FC } from 'react';

import { DexTypeEnum } from 'swap-router-sdk';

import { QUIPUSWAP_ANALYTICS_PAIRS } from '@config/config';
import { Button } from '@shared/components';
import { getTokenSymbol, isEmptyArray } from '@shared/helpers';
import { ExternalLink } from '@shared/svg';
import { useTranslation } from '@translation';

import { DexPool } from '../../types';

interface ViewPairAnlyticsProps {
  route: DexPool[];
  className: string;
  buttonClassName: string;
  iconClassName: string;
}

export const ViewPairAnlytics: FC<ViewPairAnlyticsProps> = ({ route, iconClassName, className, buttonClassName }) => {
  const { t } = useTranslation(['common']);

  if (isEmptyArray(route)) {
    return null;
  }

  return (
    <div className={className}>
      {route
        .filter(({ dexType }) => dexType === DexTypeEnum.QuipuSwap)
        .map(({ dexAddress, tokensPools: [token1Pool, token2Pool] }) => (
          <Button
            key={dexAddress}
            className={buttonClassName}
            theme="inverse"
            href={`${QUIPUSWAP_ANALYTICS_PAIRS}/${dexAddress}`}
            external
            icon={<ExternalLink className={iconClassName} />}
          >
            {t('common|View {{tokenA}}/{{tokenB}} Pair Analytics', {
              tokenA: getTokenSymbol(token1Pool.token),
              tokenB: getTokenSymbol(token2Pool.token)
            })}
          </Button>
        ))}
    </div>
  );
};
