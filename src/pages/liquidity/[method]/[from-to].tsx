import React from 'react';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@components/common/BaseLayout';
import { Liquidity } from '@containers/liquidity';
import s from '@styles/SwapLiquidity.module.sass';

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation(['common', 'liquidity']);

  return (
    <BaseLayout
      title={t('liquidity|liquidity page')}
      description={t('liquidity|liquidity page description. Couple sentences...')}
      className={s.wrapper}
    >
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
