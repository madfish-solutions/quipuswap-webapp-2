import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { Liquidity } from '@containers/Liquidity';

import s from '@styles/SwapLiquidity.module.sass';

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation(['common', 'liquidity']);
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

export const getServerSideProps = async ({ locale }:{ locale:string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'liquidity']),
  },
});

export default LiquidityPage;
