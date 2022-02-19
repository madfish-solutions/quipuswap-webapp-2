import { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { PageTitle } from '@components/common/page-title';
import { DashPlug } from '@components/ui/dash-plug';
import { useStaking } from '@containers/stake/hooks/use-staking';
import { StakingTabsCard } from '@containers/stake/item/components/staking-form/staking-tabs-card';
import { isNull, isUndefined } from '@utils/helpers';

import { StakingDetails } from './components/staking-details';
import stakingPageStyles from './stake-item.page.module.sass';

export const StakeItemPage: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const { isLoading, item, router, error } = useStaking();

  const getTitle = () => {
    if (item?.tokenB) {
      return `${item.tokenA.metadata.symbol}/${item.tokenB.metadata.symbol}`;
    }
    if (item) {
      return item.tokenA.metadata.symbol;
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  if (!isLoading && isUndefined(item)) {
    void router.replace('/404');

    return null;
  }

  if (!isLoading && isNull(item)) {
    return <PageTitle>{t('stake|Failed to load staking')}</PageTitle>;
  }

  return (
    <>
      <PageTitle>{getTitle()}</PageTitle>

      {/* TODO: add items like reward stats */}

      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails item={item} isError={!!error} />
      </StickyBlock>
    </>
  );
});
