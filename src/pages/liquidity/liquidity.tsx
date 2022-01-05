import React from 'react';

import { appi18n } from '@app.i18n';
import { BaseLayout } from '@components/common/BaseLayout';
import { Liquidity } from '@containers/Liquidity';
import s from '@styles/SwapLiquidity.module.sass';

export const LiquidityPage: React.FC = () => {
  const { t } = appi18n;

  return (
    <BaseLayout
      title={t('liquidity|Liquidity page')}
      description={t('liquidity|Liquidity page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Liquidity />
    </BaseLayout>
  );
};
