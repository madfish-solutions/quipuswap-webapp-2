import { FC } from 'react';

import { Button, ExternalLink } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_ANALYTICS_PAIRS } from '@app.config';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { DexPair } from '@utils/types';

interface ViewPairAnliticsProps {
  route: DexPair[];
  className: string;
  buttonClassName: string;
  iconClassName: string;
}

export const ViewPairAnlitics: FC<ViewPairAnliticsProps> = ({ route, iconClassName, className, buttonClassName }) => {
  const { t } = useTranslation(['common']);

  //TODO: Remove after handle swap pair without pool
  if (!route.length) {
    return null;
  }

  return (
    <div className={className}>
      {route.map(({ id, type: dexType, token1, token2 }) => (
        <Button
          key={id}
          className={buttonClassName}
          theme="inverse"
          href={dexType === 'tokenxtz' ? `${QUIPUSWAP_ANALYTICS_PAIRS}/${id}` : '#'}
          external
          icon={<ExternalLink className={iconClassName} />}
        >
          {t('common|View {{tokenA}}/{{tokenB}} Pair Analytics', {
            tokenA: getWhitelistedTokenSymbol(token1),
            tokenB: getWhitelistedTokenSymbol(token2)
          })}
        </Button>
      ))}
    </div>
  );
};
