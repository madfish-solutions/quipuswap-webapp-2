import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { SwapSend } from '@containers/SwapSend';
import LineChart from '@components/ui/LineChart';
import { LineChartSampleData } from '@components/ui/LineChart/content';

import s from '@styles/SwapSend.module.sass';

const SwapSendPage: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'swap']),
  },
});

export default SwapSendPage;
