import { useEffect, useState } from 'react';
import {
  GovernanceProposalType,
  ProposalStatus,
  ProposalType,
} from '@utils/types';
import {
  getStorageInfo,
  useGovernanceContract,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { hexToASCII, prepareIpfsLink, transformGovernanceStatus } from '@utils/helpers';
import BigNumber from 'bignumber.js';
import { STABLE_TOKEN, STABLE_TOKEN_GRANADA } from '@utils/defaults';

export const useGovernance = () => {
  const tezos = useTezos();
  const network = useNetwork();
  const governanceContract = useGovernanceContract();
  const [allProposals, setAllProposals] = useState<ProposalType[]>([]);
  const [proposalsLoaded, setLoaded] = useState<boolean>(false);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    const asyncLoad = async () => {
      if (!tezos) return;
      // TODO: change after deploy token to testnet
      const currentToken = network.id === 'granadanet' ? STABLE_TOKEN_GRANADA : STABLE_TOKEN;
      const contract = await getStorageInfo(tezos, currentToken.contractAddress);
      const tokenInfo = await contract?.token_info.get(0);
      setTotalSupply(tokenInfo);
    };
    asyncLoad();
  }, [tezos, network]);

  useEffect(() => {
    const loadGovernance = async () => {
      if (!tezos) return;
      if (!network) return;
      if (!governanceContract) return;
      if (!totalSupply) return;

      const possibleProposals:Promise<GovernanceProposalType | undefined>[] = new Array(
        +governanceContract?.id_count.toString(),
      )
        .fill(0)
        .map(async (x, id) => (governanceContract?.proposals.get(id)));

      const tempProposals = await Promise.all(possibleProposals);

      if (tempProposals) {
        const proposals:ProposalType[] = (tempProposals
          .filter((x) => !!x) as GovernanceProposalType[])
          .map((x, id) => (
            {
              id,
              name: '',
              collateral: x.collateral,
              creator: x.creator,
              config: {
                proposalStake: x.config.proposal_stake,
                votingQuorum: x.config.voting_quorum,
                supportQuorum: x.config.support_quorum,
              },
              status: Object.keys(x.status)[0] as ProposalStatus,
              forumLink: hexToASCII(x.forum_link),
              ipfsLink: hexToASCII(x.ipfs_link),
              githubLink: hexToASCII(x.github_link),
              voters: x.voters,
              endDate: x.end_date,
              startDate: x.start_date,
              votesAgainst: x.votes_against,
              votesFor: x.votes_for,
            }
          ));

        const loadDescription = async (x:any) => {
          const url = prepareIpfsLink(x.ipfsLink);
          if (!url) return null;
          const resp = await (fetch(url));
          const text = await (resp.text());
          return {
            ...x,
            name: text && text.split('title:').length > 1
              ? text.split('title:')[1].split('\r\nauthor:')[0]
              : '<WRONG PROPOSAL NAME>',
          };
        };
        const promisesFullProposals = proposals.map(loadDescription);
        const proposalsWithName = await Promise.all(promisesFullProposals);
        setAllProposals((proposalsWithName as ProposalType[]).map((x) => transformGovernanceStatus(
          {
            proposal: x,
            govContract: governanceContract,
            totalSupply,
          },
        )));
      }
      setLoaded(true);
    };

    loadGovernance();
  }, [tezos, network, governanceContract, totalSupply]);

  return { data: allProposals, loaded: proposalsLoaded, totalSupply };
};
