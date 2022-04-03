/* eslint-disable no-console */
import { useCallback, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { VotingTabs } from '@modules/voting/tabs.enum';
import { getTokenPairSlug } from '@shared/helpers';
import { useRouterPair } from '@shared/hooks/use-router-pair';
import { Token } from '@shared/types';

interface TabsContent {
  id: VotingTabs;
  label: string;
}

const VOTING = 'voting';

export const TabsContent = [
  {
    id: VotingTabs.vote,
    label: 'Vote'
  },
  {
    id: VotingTabs.veto,
    label: 'Veto'
  }
];

export const useVotingRouter = (token1: Token, token2: Token) => {
  const params = useParams();
  const navigate = useNavigate();
  console.log(params);
  const [urlLoaded, setUrlLoaded] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [votingTab, setVotingTab] = useState<VotingTabs>(params.method as VotingTabs);

  const { from, to } = useRouterPair({
    page: `${VOTING}/${params.method}`,
    urlLoaded,
    initialLoad,
    token1,
    token2
  });

  const handleSetActiveId = useCallback(
    (val: string) => {
      navigate(`/${VOTING}/${val}/${getTokenPairSlug(token1, token2)}`);
      setVotingTab(val as VotingTabs);
    },
    [token1, token2, navigate]
  );

  console.log(votingTab);
  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === votingTab)!, [votingTab]);

  return {
    urlLoaded,
    setUrlLoaded,
    initialLoad,
    setInitialLoad,
    from,
    to,
    votingTab,
    currentTab,
    setVotingTab,
    handleSetActiveId
  };
};
