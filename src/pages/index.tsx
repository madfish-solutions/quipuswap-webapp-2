import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { TopPairs } from '@containers/home/TopPairs';
import { TopFarmings } from '@containers/home/TopFarmings';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout
      title={t('home:Home page')}
      description={t('home:Home page description. Couple sentences...')}
    >
      <TopPairs />
      <TopFarmings />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home']),
  },
});

export default Home;
