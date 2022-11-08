import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';

export const useTokensListPageViewModel = () => {
  const { filteredManagedTokens } = useTokensManagerStore();

  return {
    tokens: filteredManagedTokens
  };
};
