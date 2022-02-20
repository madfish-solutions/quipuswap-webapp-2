import { useTranslation } from 'next-i18next';

import { DashPlug } from '@components/ui/dash-plug';
import { useStaking } from '@containers/staking/hooks/use-staking';
import stakingPageStyles from '@containers/staking/item/staking-item.page.module.sass';
import { isNull } from '@utils/helpers';

export const useStakeItemPageViewModel = () => {
  const { t } = useTranslation(['common', 'stake']);
  const { isLoading, stakeItem, error } = useStaking();

  const getTitle = () => {
    if (stakeItem?.tokenB) {
      return `${stakeItem.tokenA.metadata.symbol}/${stakeItem.tokenB.metadata.symbol}`;
    }

    if (stakeItem) {
      return stakeItem.tokenA.metadata.symbol;
    }

    if (!isLoading && isNull(stakeItem)) {
      return t('stake|Failed to load staking');
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  return { isLoading, stakeItem, error, getTitle };
};
