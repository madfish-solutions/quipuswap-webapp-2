import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { Liquidity } from '@containers/Liquidity';
import { LineChartSampleData } from '@components/ui/LineChart/content';

import s from '@styles/SwapLiquidity.module.sass';

const LineChart = dynamic(() => import('@components/ui/LineChart'), {
  ssr: false,
});

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation(['common', 'liquidity']);

  return (
    <BaseLayout
      title={t('liquidity:Liquidity page')}
      description={t('liquidity:Liquidity page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Liquidity />
      <LineChart className={s.chart} data={LineChartSampleData} />
    </BaseLayout>
  );
};

export const getStaticPaths = async () => ({
  paths: [
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'en' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'fr' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'ru' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'es' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'pt' },
  ],
  fallback: true,
});
export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'liquidity']),
  },
});

export default LiquidityPage;
