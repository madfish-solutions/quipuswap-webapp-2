import { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { PageTitle } from '@components/common/page-title';
import { StakingTabsCard } from '@containers/stake/item/components/staking-form/staking-tabs-card';
import { useStakeItemPageViewModel } from '@containers/stake/item/use-stake-item-page.vm';
import { isNull, isUndefined } from '@utils/helpers';

import { StakingDetails } from './components/staking-details';

export const StakeItemPage: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const router = useRouter();
  const { isLoading, stakeItem, error, getTitle } = useStakeItemPageViewModel();

  if (!isLoading && isUndefined(stakeItem)) {
    void router.replace('/404');

    return null;
  }

  if (!isLoading && isNull(stakeItem)) {
    return <PageTitle>{t('stake|Failed to load staking')}</PageTitle>;
  }

  return (
    <>
      <PageTitle>{getTitle()}</PageTitle>

      {/* TODO: add items like reward stats */}

      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails item={stakeItem} isError={!!error} />
      </StickyBlock>
    </>
  );
});
