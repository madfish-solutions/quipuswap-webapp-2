import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout
      title={t('liquidity:Liquidity page')}
      description={t('liquidity:Liquidity page description. Couple sentences...')}
    />
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'liquidity']),
  },
});

export default Home;
