import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { getTokenSlug, isEmptyArray, isNull } from '@shared/helpers';
// import { useTokensWithBalances } from '@shared/hooks';
import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';
import { Token } from '@shared/types';

import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();

  const tokensManagerStore = useTokensManagerStore();

  const { filteredTokens, filteredManagedTokens, search, tokenIdValue, isSearching } = tokensManagerStore;

  // const tokenBlances = useTokensWithBalances(tokens);

  useEffect(() => {
    if (isEmptyArray(filteredTokens)) {
      tokensManagerStore.searchCustomToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyArray(filteredTokens), tokensManagerStore]);

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
    return filteredTokens.map(token => {
      const isTokenChoosen = choosenTokensSlugs.includes(getTokenSlug(token));

      return {
        token: {
          ...token,
          isChoosen: isTokenChoosen
        },
        balance: null,
        onTokenClick: () => onTokenClick(token)
      };
    });
  }, [choosenTokensSlugs, onTokenClick, filteredTokens]);

  const managedTokensModalCellParams = useMemo(() => {
    return filteredManagedTokens.map(token => {
      return {
        token,
        onFavoriteClick: () => tokensManagerStore.addOrRemoveTokenFavorite(token),
        onHideToken: () => tokensManagerStore.hideOrShowToken(token)
      };
    });
  }, [filteredManagedTokens, tokensManagerStore]);

  //#region create hook to aviod code repeating
  const handeTokensSearchChange = (event: FormEvent<HTMLInputElement>) => {
    if (isNull(event)) {
      return;
    }
    tokensManagerStore.onSearchChange((event.target as HTMLInputElement).value);
  };

  const handleTokenIdChange = (event: FormEvent<HTMLInputElement>) => {
    if (isNull(event) || isNull(event.target)) {
      return;
    }
    tokensManagerStore.onTokenIdChange((event.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    tokensManagerStore.handleIncrement();
  };

  const handleDecrement = () => {
    tokensManagerStore.handleDecrement();
  };
  //#endregion create hook to aviod code repeating

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
    isSearching,
    setTokens,
    tokensModalCellParams,
    managedTokensModalCellParams,
    isModalOpen: tokensModalStore.isOpen,
    openTokensModal,
    closeTokensModal,
    headerProps: {
      tabsProps,

      search,
      tokenIdValue,

      handeTokensSearchChange,
      handleTokenIdChange,
      handleIncrement,
      handleDecrement
    }
  };
};
