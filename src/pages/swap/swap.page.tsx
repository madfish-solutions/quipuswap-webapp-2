import { FC } from 'react';

import { appi18n } from '@app.i18n';
import { BaseLayout } from '@components/common/BaseLayout';
import { SwapSend } from '@containers/swap-send';
import s from '@styles/SwapLiquidity.module.sass';

interface SwapSendPageProps {
  fromToSlug?: string;
}

export const SwapPage: FC<SwapSendPageProps> = ({ fromToSlug }) => {
  const { t } = appi18n;

  return (
    <BaseLayout
      title={t('swap|Swap page')}
      description={t('swap|Swap page description. Couple sentences...')}
      className={s.wrapper}
    >
      <SwapSend fromToSlug={fromToSlug} />
    </BaseLayout>
  );
};
