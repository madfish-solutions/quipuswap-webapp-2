import { FC } from 'react';

import { appi18n } from '@app.i18n';
import { BaseLayout } from '@components/common/BaseLayout';
import { DexDashboard } from '@components/home/DexDashboard';
import { News } from '@components/home/News';
import { Opportunities } from '@components/home/Opportunities';
import { TopPairs } from '@containers/home/TopPairs';
import { useNetwork } from '@utils/dapp';

export const HomePage: FC = () => {
  const { t } = appi18n;
  const network = useNetwork();

  return (
    <BaseLayout title={t('home|HomePage page')} description={t('home|HomePage page description. Couple sentences...')}>
      <News />
      <DexDashboard />
      <Opportunities />
      {network.type === 'main' ? <TopPairs /> : null}
      {/* TODO: Implement it. */}
      {/* <TopFarmings /> */}
    </BaseLayout>
  );
};
