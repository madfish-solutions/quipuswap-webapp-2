import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout
      title={t('home:Home page')}
      description={t('home:Home page description. Couple sentences...')}
    >
      There will be home page
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home']),
  },
});

export default Home;
