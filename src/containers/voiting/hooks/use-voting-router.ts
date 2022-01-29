import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useRouterPair } from '@hooks/useRouterPair';
import { getTokenSlug } from '@utils/helpers';
import { WhitelistedTokenPair } from '@utils/types';

import { VotingTabs } from '../tabs.enum';

const VOTING = 'voting';

const TabsContent = [
  {
    id: VotingTabs.vote,
    label: 'Vote'
  },
  {
    id: VotingTabs.veto,
    label: 'Veto'
  }
];

export const useVotingRouter = (tokensPair: WhitelistedTokenPair) => {
  const router = useRouter();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState<VotingTabs>(router.query.method as VotingTabs);

  const { from, to } = useRouterPair({
    page: `${VOTING}/${router.query.method}`,
    urlLoaded,
    initialLoad,
    token1: tokensPair.token1,
    token2: tokensPair.token2
  });

  const handleSetActiveId = useCallback(
    (val: string) => {
      router.replace(
        `/voting/${val}/${getTokenSlug(tokensPair.token1)}-${getTokenSlug(tokensPair.token2)}`,
        undefined,
        {
          shallow: true,
          scroll: false
        }
      );
      setTabsState(val as VotingTabs);
    },
    [tokensPair, router]
  );

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === tabsState)!, [tabsState]);

  return {
    urlLoaded,
    setUrlLoaded,
    initialLoad,
    setInitialLoad,
    from,
    to,
    tabsState,
    currentTab,
    setTabsState,
    handleSetActiveId
  };
};
