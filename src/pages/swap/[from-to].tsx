import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@layouts/BaseLayout';
import { SwapSend } from '@containers/SwapSend';
import { LineChartSampleData } from '@components/ui/LineChart/content';

import s from '@styles/SwapLiquidity.module.sass';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const LineChart = dynamic(() => import('@components/ui/LineChart'), {
  ssr: false,
});

const SwapSendPage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap:Swap page')}
      description={t('swap:Swap page description. Couple sentences...')}
      className={s.wrapper}
    >
      <SwapSend />
      <LineChart className={s.chart} data={LineChartSampleData} />
    </BaseLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'swap']),
  },
});

export default SwapSendPage;
