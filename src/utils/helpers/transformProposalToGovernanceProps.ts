import { STABLE_TOKEN } from '@utils/defaults';
import { GovernanceCardProps, ProposalType } from '@utils/types';
import { prepareIpfsLink } from './prepareIpfsLink';

export const transformProposalToGovernanceProps = (x:ProposalType) => ({
  name: x.name,
  description: prepareIpfsLink(x.ipfsLink),
  ipfsLink: prepareIpfsLink(x.ipfsLink),
  githubLink: prepareIpfsLink(x.githubLink),
  shortDescription: x.name,
  workDates: [new Date(x.startDate), new Date(x.endDate)],
  status: x.status.toUpperCase(),
  currency: STABLE_TOKEN.metadata.symbol,
  voted: x.votesAgainst.plus(x.votesFor).toString(),
  support: x.votesFor.toString(),
  reject: x.votesAgainst.toString(),
  participants: x.voters.toString(),
  quorum: x.votesAgainst.toString(),
  votes: '0', // user votes
  claimable: '0', // user votes after status pending
  id: `${x.id}`,
  author: x.creator,
}) as GovernanceCardProps;
