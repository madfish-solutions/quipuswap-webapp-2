import React from 'react';

import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { TestnetAlert } from '@components/common/testnet-alert';
import { SwapSend } from '@containers/swap-send';
import { SwapTabAction } from '@interfaces/types';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/SwapLiquidity.module.sass';

export const makeSwapSendPage = (action: SwapTabAction) => {
  return () => {
    const { t } = useTranslation(['common', 'swap']);

    return (
      <BaseLayout
        title={t(`swap|Swap page - ${SITE_TITLE}`)}
        description={t(`swap|${SITE_DESCRIPTION}`)}
        className={s.wrapper}
      >
        <TestnetAlert />
        <SwapSend initialAction={action} />
      </BaseLayout>
    );
  };
};
