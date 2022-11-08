import { observer } from 'mobx-react-lite';

import { PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { useTokensListPageViewModel } from './use-tokens-list-page.vm';

export const TokensListPage = observer(() => {
  const { isLoading } = useTokensListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="tokensListPageTitle">Tokens</PageTitle>
      <StateWrapper isLoading={isLoading} loaderFallback={<>Loading...</>}>
        Hello world
      </StateWrapper>
    </>
  );
});
