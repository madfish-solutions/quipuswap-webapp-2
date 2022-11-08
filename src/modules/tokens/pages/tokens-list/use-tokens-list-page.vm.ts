import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';
import { ManagedToken } from '@shared/types';

export const useTokensListPageViewModel = () => {
  const { tokens } = useTokensManagerStore();

  const onFavoriteClick = (token: ManagedToken) => null;
  const onHideClick = (token: ManagedToken) => null;

  return {
    tokens,
    onFavoriteClick,
    onHideClick
  };
};
