import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert, StateWrapper } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipPageViewModel } from './coinflip-page.vm';
import styles from './coinflip.page.module.scss';
import { CoinflipGame, CoinflipTokenSelector, CoinflipDashboardStatsInfo } from './components';
// TODO: Game title localization
import { useCoinflipGeneralStats } from './hooks';

export const CoinflipPage: FC = observer(() => {
  const { isInitialized } = useCoinflipPageViewModel();
  const { t } = useTranslation();
  const { isLoading } = useCoinflipGeneralStats();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('coinflip|Game')}</PageTitle>

      <CoinflipTokenSelector />

      <CoinflipDashboardStatsInfo isLoading={isLoading} />

      <div className={styles.game}>
        <CoinflipGame />
      </div>
    </StateWrapper>
  );
});
