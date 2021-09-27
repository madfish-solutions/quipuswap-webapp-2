import { GovernanceStorageInfo, ProposalType } from '@utils/types';
import BigNumber from 'bignumber.js';

type TransformGovernanceStatusParams = {
  proposal: ProposalType,
  govContract: GovernanceStorageInfo,
  totalSupply: BigNumber,
};

export const transformGovernanceStatus = ({
  proposal,
  govContract,
  totalSupply,
}:TransformGovernanceStatusParams) => {
  let { status } = proposal;
  const {
    votesAgainst, votesFor, config, endDate,
  } = proposal;
  if ((status === 'voting' || status === 'pending') && new Date(endDate).getTime() < Date.now()) {
    if (status === 'voting') {
      if (votesAgainst
        .plus(votesFor)
        .lt(config.votingQuorum
          .dividedBy(govContract.accuracy)
          .multipliedBy(totalSupply))) {
        status = 'underrated';
      } else if (votesFor
        .lt(config.supportQuorum
          .dividedBy(govContract.accuracy)
          .multipliedBy(totalSupply))) {
        status = 'rejected';
      }
    }
  }
  return {
    ...proposal,
    status,
  };
};
