import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { DexDashboard } from '@components/home/DexDashboard';
import { News } from '@components/home/News';
import { Opportunities } from '@components/home/Opportunities';
import { TopPairs } from '@containers/home/TopPairs';
import { useNetwork } from '@utils/dapp';
import { QSNetworkType } from '@utils/types';

export const Home: FC = () => {
  const { t } = useTranslation(['common', 'home']);
  const network = useNetwork();

  return (
    <BaseLayout title={t('home|Home page')} description={t('home|Home page description. Couple sentences...')}>
      <News />
      <DexDashboard />
      <Opportunities />
      {network.type === QSNetworkType.MAIN ? <TopPairs /> : null}
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
