import React from 'react';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DexDashboard } from '@components/home/DexDashboard';
import { News } from '@components/home/News';
import { Opportunities } from '@components/home/Opportunities';
import { TopPairs } from '@containers/home/TopPairs';
import { BaseLayout } from '@layouts/BaseLayout';
import { useNetwork } from '@utils/dapp';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);
  const network = useNetwork();

  return (
    <BaseLayout title={t('home|Home page')} description={t('home|Home page description. Couple sentences...')}>
      <News />
      <DexDashboard />
      <Opportunities />
      {network.type === 'main' ? <TopPairs /> : null}
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'home']))
  }
});

// eslint-disable-next-line import/no-default-export
export default Home;
