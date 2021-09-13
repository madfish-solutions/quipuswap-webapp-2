import { STABLE_TOKEN } from '@utils/defaults';
import { GovernanceCardProps, ProposalType } from '@utils/types';
import { prepareIpfsLink } from './prepareIpfsLink';

export const transformProposalToGovernanceProps = (x:ProposalType) => ({
  name: x.name,
  description: prepareIpfsLink(x.ipfsLink),
  ipfsLink: prepareIpfsLink(x.ipfsLink),
  shortDescription: x.name,
  workDates: [new Date(x.startDate), new Date(x.endDate)],
  status: x.status.toUpperCase(),
  currency: STABLE_TOKEN.metadata.symbol,
  voted: x.votesFor.toString(),
  support: '100,000.00',
  reject: x.votesAgainst.toString(),
  votes: '0',
  claimable: '0',
  id: `${x.id}`,
  author: x.creator,
}) as GovernanceCardProps;
