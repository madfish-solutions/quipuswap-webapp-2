import { FC } from 'react';

import { DexTypeEnum } from 'swap-router-sdk';

import { QUIPUSWAP_ANALYTICS_PAIRS } from '@config/config';
import { Button } from '@shared/components';
import { getTokenSymbol } from '@shared/helpers';
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

  //TODO: Remove after handle swap pair without pool
  if (!route.length) {
    return null;
  }

  return (
    <div className={className}>
      {/* TODO: remove filtering and specify URL for token/token analytics as soon as it is implemented */}
      {route
        .filter(({ dexType }) => dexType === DexTypeEnum.QuipuSwap)
        .map(({ dexAddress, token1, token2 }) => (
          <Button
            key={dexAddress}
            className={buttonClassName}
            theme="inverse"
            href={`${QUIPUSWAP_ANALYTICS_PAIRS}/${dexAddress}`}
            external
            icon={<ExternalLink className={iconClassName} />}
          >
            {t('common|View {{tokenA}}/{{tokenB}} Pair Analytics', {
              tokenA: getTokenSymbol(token1),
              tokenB: getTokenSymbol(token2)
            })}
          </Button>
        ))}
    </div>
  );
};
