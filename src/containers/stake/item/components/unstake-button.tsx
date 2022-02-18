import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Button } from '@components/ui/elements/button';
import { getCandidateInfo, unstake } from '@containers/stake/item/helpers';
import { useStaker, useStakingId, useStakingRouting } from '@containers/stake/item/helpers/staking.provider';
import { StakingTabs } from '@containers/stake/item/types';
import { useBakers, useTezos } from '@utils/dapp';
import { isExist } from '@utils/helpers';

export interface UnstakeButtonProps {
  className: string;
}

const EMPTY_POOL = 0;

export const UnstakeButton: FC<UnstakeButtonProps> = ({ className }) => {
  const tezos = useTezos();
  const { candidate, stake } = useStaker();
  const { currentTab } = useStakingRouting();
  const stakingId = useStakingId();
  const { data: bakers } = useBakers();

  const isStakeTab = currentTab.id === StakingTabs.stake;
  const { currentCandidate } = stakingId ? getCandidateInfo(stakingId, bakers) : { currentCandidate: null };

  const wrapCandidate = isStakeTab ? candidate : currentCandidate?.address;

  const isCandidateAbsent = !isExist(wrapCandidate);

  const handleUnstake = async () => {
    if (!tezos || !stakingId || isCandidateAbsent) {
      return;
    }

    unstake(stakingId);
  };

  const isButtonDisabled = new BigNumber(stake ?? '0').eq(EMPTY_POOL) || isCandidateAbsent;

  return (
    <Button onClick={handleUnstake} className={className} theme="secondary" disabled={isButtonDisabled}>
      Unstake
    </Button>
  );
};
