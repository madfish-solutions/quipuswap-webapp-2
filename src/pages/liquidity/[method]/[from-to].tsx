import React from 'react';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@components/common/BaseLayout';
import { TestnetAlert } from '@components/common/testnet-alert';
import { Liquidity } from '@containers/liquidity';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/SwapLiquidity.module.sass';

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation(['common', 'liquidity']);

  return (
    <BaseLayout
      title={t(`liquidity|Liquidity - ${SITE_TITLE}`)}
      description={t(`liquidity|${SITE_DESCRIPTION}`)}
      className={s.wrapper}
    >
      <TestnetAlert />
      <Liquidity />
    </BaseLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'liquidity']))
  }
});

// eslint-disable-next-line import/no-default-export
export default LiquidityPage;
