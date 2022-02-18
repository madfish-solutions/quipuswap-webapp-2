import { StickyBlock } from '@quipuswap/ui-kit';

import { PageTitle } from '@components/common/page-title';
import { DashPlug } from '@components/ui/dash-plug';
import { StakeItem as StakeItemProps } from '@interfaces/staking';
import { Nullable } from '@utils/types';

import { StakingDetails } from './components/staking-details';
import { WrappedStakingForm } from './components/staking-form';
import { StakingProvider } from './helpers/staking.provider';
import stakingPageStyles from './stake-item.page.module.sass';

interface Props {
  data: Nullable<StakeItemProps>;
  isError: boolean;
}

export const StakeItem = ({ data, isError }: Props) => {
  if (isError) {
    return <PageTitle>Failed to load staking</PageTitle>;
  }

  return (
    <StakingProvider data={data}>
      <PageTitle>
        {data?.tokenB && `${data.tokenA.metadata.symbol}/${data.tokenB.metadata.symbol}`}
        {data && !data.tokenB && data.tokenA.metadata.symbol}
        {!data && <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />}
      </PageTitle>

      {/* TODO: add items like reward stats */}

      <StickyBlock>
        <WrappedStakingForm />
        <StakingDetails data={data} isError={isError} />
      </StickyBlock>
    </StakingProvider>
  );
};
