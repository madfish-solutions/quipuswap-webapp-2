import { useState } from 'react';

import { useRouter } from 'next/router';

import { useParseTokensFromUrl } from './hooks';

export const TabsContent = [
  {
    id: 'add',
    label: 'Add'
  },
  {
    id: 'remove',
    label: 'Remove'
  }
];

export const useLiquidityFormService = () => {
  const router = useRouter();
  const { tokenA, tokenB, setTokenA, setTokenB } = useParseTokensFromUrl();

  const [tabState, setTabState] = useState(TabsContent[0]);

  const handleSetActiveId = (tabId: string) => {
    const url = router.asPath.split('/');
    url[2] = tabId;
    const newUrl = url.join('/');

    void router.replace(newUrl, undefined, { shallow: true });
    const findActiveTab = TabsContent.find(tab => tab.id === tabId);
    if (!findActiveTab) return;
    setTabState(findActiveTab);
  };

  return {
    tabState,
    handleSetActiveId,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB
  };
};
