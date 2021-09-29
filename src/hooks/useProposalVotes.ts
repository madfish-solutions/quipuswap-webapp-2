import { useNetwork } from '@utils/dapp';
import {
  GOVERNANCE_CONTRACT_MAINNET, GOVERNANCE_CONTRACT_TESTNET, TZKT_VOTES_MAINNET, TZKT_VOTES_TESTNET,
} from '@utils/defaults';
import { useState, useEffect } from 'react';

export const useProposalVotes = (proposal: string) => {
  const network = useNetwork();
  const [
    { loadedVotes, isLoaded },
    setDescription,
  ] = useState<{ loadedVotes:any[], isLoaded: boolean }>({ loadedVotes: [], isLoaded: false });

  // const votesData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((x) => ({
  //   id: x,
  //   address: 'tz1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  //   value: '10.00',
  //   votes: '1000000',
  //   for: Math.random() > 0.5,
  // }));

  useEffect(() => {
    const loadVotes = () => {
      const url = `${network.id === 'mainnet' ? TZKT_VOTES_MAINNET : TZKT_VOTES_TESTNET}${network.id === 'mainnet' ? GOVERNANCE_CONTRACT_MAINNET : GOVERNANCE_CONTRACT_TESTNET}&parameter.proposal=${proposal}&status=applied`;
      fetch(url).then((x) => x.json()).then((x) => {
        let votes: any[] = [];
        if (Array.isArray(x)) {
          votes = x.map((y) => ({
            id: y.hash,
            address: y.sender.address,
            value: y.parameter.value.vote.against ?? y.parameter.value.vote.for ?? 0,
            votes: y.parameter.value.vote.against ?? y.parameter.value.vote.for ?? 0,
            for: !y.parameter.value.vote.against,
          }));
        }
        console.log(votes);
        setDescription(
          {
            loadedVotes: votes,
            isLoaded: true,
          },
        );
      }).catch(() => setDescription({ loadedVotes: [], isLoaded: false }));
    };
    loadVotes();
  }, [network, proposal]);

  return { loadedVotes, isLoaded };
};
