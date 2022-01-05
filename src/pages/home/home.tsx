import React from 'react';

import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { DexDashboard } from '@components/home/DexDashboard';
import { News } from '@components/home/News';
import { Opportunities } from '@components/home/Opportunities';
import { TopPairs } from '@containers/home/TopPairs';
import { useNetwork } from '@utils/dapp';

export const Home: React.FC = () => {
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
