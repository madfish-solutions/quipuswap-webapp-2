import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@layouts/BaseLayout';
import { SwapSend } from '@containers/SwapSend';
import { LineChartSampleData } from '@components/ui/LineChart/content';

import s from '@styles/SwapLiquidity.module.sass';

const LineChart = dynamic(() => import('@components/ui/LineChart'), {
  ssr: false,
});

export async function getStaticPaths() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
//   const res = await fetch('https://.../posts');
//   const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  //   const res = await fetch('https://.../posts');
  //   const posts = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {},
  };
}

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

export default SwapSendPage;
