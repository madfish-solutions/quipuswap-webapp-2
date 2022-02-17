import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useRouterPair } from '@hooks/useRouterPair';
import { getTokenPairSlug } from '@utils/helpers';
import { Token } from '@utils/types';

import { VotingTabs } from '../tabs.enum';

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
  const router = useRouter();
  const [urlLoaded, setUrlLoaded] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [votingTab, setVotingTab] = useState<VotingTabs>(router.query.method as VotingTabs);

  const { from, to } = useRouterPair({
    page: `${VOTING}/${router.query.method}`,
    urlLoaded,
    initialLoad,
    token1,
    token2
  });

  const handleSetActiveId = useCallback(
    async (val: string) => {
      await router.replace(`/${VOTING}/${val}/${getTokenPairSlug(token1, token2)}`, undefined, {
        shallow: true,
        scroll: false
      });
      setVotingTab(val as VotingTabs);
    },
    [token1, token2, router]
  );

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
