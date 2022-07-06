import { FormEvent, useEffect, useMemo } from 'react';

import { isEmptyArray, isNull } from '@shared/helpers';
import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';

import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();
  const { chosenTokens } = tokensModalStore;

  const tokensManagerStore = useTokensManagerStore();

  const { filteredTokens, filteredManagedTokens, search, tokenIdValue, isSearching } = tokensManagerStore;

  useEffect(() => {
    if (isEmptyArray(filteredManagedTokens)) {
      void tokensManagerStore.searchCustomToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyArray(filteredManagedTokens), tokensManagerStore]);

  // TODO - move to the TokensManagerStore
  // useEffect(() => {
  //   setChosenTokens(prevTokens =>
  //     prevTokens.filter(chosenToken => tokens.find(token => isTokenEqual(chosenToken, token)))
  //   );
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-magic-numbers
  // }, [managedTokens.reduce((acc, { isHidden }) => (isHidden ? acc + 1 : acc), 0)]);

  const tokensModalCellParams = useMemo(() => {
    return filteredTokens.map(token => {
      const isTokenChosen = tokensModalStore.isChosenToken(token);

      return {
        chosenTokens,
        token: {
          ...token,
          isChosen: isTokenChosen
        },
        balance: null,
        onTokenClick: () => tokensModalStore.toggleChosenToken(token)
      };
    });
  }, [chosenTokens, tokensModalStore, filteredTokens]);

  const managedTokensModalCellParams = useMemo(() => {
    return filteredManagedTokens.map(token => {
      return {
        token,
        // TODO: Use this handlers
        onFavoriteClick: () => tokensManagerStore.addOrRemoveTokenFavorite(token),
        onHideToken: () => tokensManagerStore.hideOrShowToken(token)
      };
    });
  }, [filteredManagedTokens, tokensManagerStore]);

  //#region create hook to avoid code repeating
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
  //#endregion create hook to avoid code repeating

  const closeTokensModal = () => {
    tokensManagerStore.onSearchChange('');
    tokensManagerStore.onTokenIdChange('');
    tokensModalStore.close();
  };

  const setTokens = () => {
    closeTokensModal();
  };

  return {
    isSearching,
    setTokens,
    tokensModalCellParams,
    managedTokensModalCellParams,
    isModalOpen: tokensModalStore.isOpen,
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
