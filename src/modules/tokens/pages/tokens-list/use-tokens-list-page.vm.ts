import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';

export const useTokensListPageViewModel = () => {
  const isReady = useReady();
  const { accountPkh } = useAuthStore();
  const isLoading = !isReady || !accountPkh;

  return {
    isLoading
  };
};
