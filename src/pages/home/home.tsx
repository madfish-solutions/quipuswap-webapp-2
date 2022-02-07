import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { IS_NETWORK_MAINNET } from '@app.config';
import { BaseLayout } from '@components/common/BaseLayout';
import { TestnetAlert } from '@components/common/testnet-alert';
import { DexDashboard } from '@components/home/DexDashboard';
import { News } from '@components/home/News';
import { Opportunities } from '@components/home/Opportunities';
import { TopPairs } from '@containers/home/TopPairs';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';

export const Home: FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout title={t(`home|${SITE_TITLE}`)} description={t(`home|${SITE_DESCRIPTION}`)}>
      <TestnetAlert />
      <News />
      <DexDashboard />
      <Opportunities />
      {IS_NETWORK_MAINNET && <TopPairs />}
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
