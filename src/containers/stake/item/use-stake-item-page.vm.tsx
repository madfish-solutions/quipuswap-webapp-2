import { DashPlug } from '@components/ui/dash-plug';
import { useStaking } from '@containers/stake/hooks/use-staking';
import stakingPageStyles from '@containers/stake/item/stake-item.page.module.sass';

export const useStakeItemPageViewModel = () => {
  const { isLoading, stakeItem, error } = useStaking();

  const getTitle = () => {
    if (stakeItem?.tokenB) {
      return `${stakeItem.tokenA.metadata.symbol}/${stakeItem.tokenB.metadata.symbol}`;
    }
    if (stakeItem) {
      return stakeItem.tokenA.metadata.symbol;
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  return { isLoading, stakeItem, error, getTitle };
};
