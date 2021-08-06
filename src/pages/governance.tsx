import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { Governance } from '@containers/Governance';
import { LineChartSampleData } from '@components/ui/LineChart/content';

import s from '@styles/SwapLiquidity.module.sass';

const LineChart = dynamic(() => import('@components/ui/LineChart'), {
  ssr: false,
});

const GovernancePage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap:Governance page')}
      description={t('swap:Governance page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Governance />
      <LineChart className={s.chart} data={LineChartSampleData} />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'governance']),
  },
});

export default GovernancePage;
