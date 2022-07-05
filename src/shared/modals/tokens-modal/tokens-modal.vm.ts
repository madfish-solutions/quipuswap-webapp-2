import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { getTokenSlug, isEmptyArray, isNull, isTokenEqual } from '@shared/helpers';
// import { useTokensWithBalances } from '@shared/hooks';
import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';
import { ManagedToken, Token } from '@shared/types';

import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();

  const tokensManagerStore = useTokensManagerStore();

  const { filteredTokens, filteredManagedTokens, search, tokenIdValue, isSearching, managedTokens, tokens } =
    tokensManagerStore;

  const [choosenTokens, setChoosenTokens] = useState<Array<ManagedToken>>([]);

  const choosenTokensSlugs = useMemo(() => choosenTokens.map(getTokenSlug), [choosenTokens]);
  // const tokenBlances = useTokensWithBalances(tokens);

  useEffect(() => {
    if (isEmptyArray(filteredManagedTokens)) {
      tokensManagerStore.searchCustomToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyArray(filteredManagedTokens), tokensManagerStore]);

  useEffect(() => {
    setChoosenTokens(prevTokens =>
      prevTokens.filter(choosenToken => tokens.find(token => isTokenEqual(choosenToken, token)))
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-magic-numbers
  }, [managedTokens.reduce((acc, { isHidden }) => (isHidden ? acc + 1 : acc), 0)]);

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
    tokensManagerStore.onSearchChange('');
    tokensManagerStore.onTokenIdChange('');

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
