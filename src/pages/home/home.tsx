import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { NETWORK } from '@app.config';
import { BaseLayout } from '@components/common/BaseLayout';
import { TestnetAlert } from '@components/common/testnet-alert';
import { DexDashboard } from '@components/home/DexDashboard';
import { News } from '@components/home/News';
import { Opportunities } from '@components/home/Opportunities';
import { TopPairs } from '@containers/home/TopPairs';
import { isNetworkMainnet } from '@utils/helpers';

export const Home: FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout title={t('home|Home page')} description={t('home|Home page description. Couple sentences...')}>
      <TestnetAlert />
      <News />
      <DexDashboard />
      <Opportunities />
      {isNetworkMainnet(NETWORK) && <TopPairs /> }
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
