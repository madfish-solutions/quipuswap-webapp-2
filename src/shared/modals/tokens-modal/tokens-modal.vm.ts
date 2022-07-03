import { useCallback, useMemo, useState } from 'react';

import { getTokenSlug } from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';
import { Token } from '@shared/types';

import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();

  const tokensManagerStore = useTokensManagerStore();

  const { tokens, managedTokens } = tokensManagerStore;

  const tokenBlances = useTokensWithBalances(tokens);

  const [choosenTokens, setChoosenTokens] = useState<Array<Token>>([]);

  const choosenTokensSlugs = useMemo(() => choosenTokens.map(getTokenSlug), [choosenTokens]);

  const onTokenClick = useCallback(
    (token: Token) => {
      if (choosenTokensSlugs.includes(getTokenSlug(token))) {
        const newChoosenToken = choosenTokens.filter(
          choosenToken => getTokenSlug(choosenToken) !== getTokenSlug(token)
        );

        setChoosenTokens(_ => newChoosenToken);
      } else {
        setChoosenTokens(prev => [...prev, token]);
      }
    },
    [choosenTokens, choosenTokensSlugs]
  );

  const tokensModalCellParams = useMemo(() => {
    return tokenBlances.map(({ token, balance }) => {
      const isTokenChoosen = choosenTokensSlugs.includes(getTokenSlug(token));

      return {
        token: {
          ...token,
          isChoosen: isTokenChoosen
        },
        balance,
        onTokenClick: () => onTokenClick(token),
        onDeleteToken: () => tokensManagerStore.hideOrShowToken(token)
      };
    });
  }, [choosenTokensSlugs, onTokenClick, tokenBlances, tokensManagerStore]);

  const managedTokensModalCellParams = useMemo(() => {
    return managedTokens.map(token => {
      return {
        token,
        onFavoriteClick: () => tokensManagerStore.addOrRemoveTokenFavorite(token),
        onHideToken: () => tokensManagerStore.hideOrShowToken(token)
      };
    });
  }, [managedTokens, tokensManagerStore]);

  const openTokensModal = () => {
    tokensModalStore.setOpenState(true);
  };

  const closeTokensModal = () => {
    tokensModalStore.setOpenState(false);
  };

  const setTokens = () => {
    tokensModalStore.setChoosenTokens(choosenTokens);

    closeTokensModal();
  };

  return {
    setTokens,
    tokensModalCellParams,
    managedTokensModalCellParams,
    isModalOpen: tokensModalStore.isOpen,
    openTokensModal,
    closeTokensModal,
    tabsProps
  };
};
