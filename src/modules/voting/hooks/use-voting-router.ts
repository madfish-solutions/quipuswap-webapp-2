import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
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

const isVotingTabId = (id: string): id is VotingTabs => {
  return TabsContent.some(tab => tab.id === id);
};

export const useVotingRouter = (token1: Token, token2: Token) => {
  const params = useParams();
  const navigate = useNavigate();
  const method = params.method ?? VotingTabs.vote;

  const [urlLoaded, setUrlLoaded] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [votingTab, setVotingTab] = useState<VotingTabs>(isVotingTabId(method) ? method : VotingTabs.vote);

  const { from, to } = useRouterPair({
    page: `${VOTING}/${method}`,
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

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === votingTab)!, [votingTab]);

  useEffect(() => {
    if (!isVotingTabId(method)) {
      navigate(`${AppRootRoutes.Voting}/${NOT_FOUND_ROUTE_NAME}`);
    }
  }, [method, navigate]);

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
