import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';

export const useTokensListPageViewModel = () => {
  const { managedTokens } = useTokensManagerStore();

  return {
    tokens: managedTokens
  };
};
