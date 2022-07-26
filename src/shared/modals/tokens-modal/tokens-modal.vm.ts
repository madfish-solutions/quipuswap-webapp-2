import { useCallback, useEffect, useMemo } from 'react';

import { isEmptyArray } from '@shared/helpers';
import { useBaseFilterStoreConverter } from '@shared/hooks';
import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';
import { noopMap } from '@shared/mapping';
import { isValidContractAddress } from '@shared/validators';

import { ManagedTokensModalCellProps, TokensModalCellProps } from './components';
import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();
  const { chosenTokens, extendTokens, minQuantity, maxQuantity, tokensQuantityStatus, isTokensQuantityOk } =
    tokensModalStore;

  const tokensManagerStore = useTokensManagerStore();

  const {
    search,
    tokenIdValue,

    onSearchChange: handeTokensSearchChange,
    onTokenIdChange: handleTokenIdChange,

    handleIncrement,
    handleDecrement
  } = useBaseFilterStoreConverter(tokensManagerStore);

  const { filteredManagedTokens, isSearching } = tokensManagerStore;

  //TODO: find a better way
  useEffect(() => {
    if (isEmptyArray(filteredManagedTokens)) {
      void tokensManagerStore.searchCustomToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyArray(filteredManagedTokens), tokensManagerStore]);

  const tokensModalCellParams: TokensModalCellProps[] = useMemo(() => {
    noopMap(chosenTokens);

    return extendTokens.map(token => ({
      token,
      balance: null,
      onTokenClick: () => tokensModalStore.toggleChosenToken(token)
    }));
  }, [chosenTokens, extendTokens, tokensModalStore]);

  const managedTokensModalCellParams: ManagedTokensModalCellProps[] = useMemo(() => {
    return filteredManagedTokens.map(token => {
      return {
        token,
        // TODO: Use this handlers
        onFavoriteClick: () => tokensManagerStore.addOrRemoveTokenFavorite(token),
        onHideClick: () => tokensManagerStore.hideOrShowToken(token)
      };
    });
  }, [filteredManagedTokens, tokensManagerStore]);

  const clearInputs = useCallback(() => {
    tokensManagerStore.onSearchChange('');
    tokensManagerStore.onTokenIdChange('');
  }, [tokensManagerStore]);

  const closeTokensModal = () => {
    clearInputs();
    tokensModalStore.close({ abort: true });
  };

  const setTokens = () => {
    clearInputs();
    tokensModalStore.close();
  };

  const showTokenIdInput = isValidContractAddress(search);

  return {
    isSearching,
    setTokens,
    tokensModalCellParams,
    managedTokensModalCellParams,
    isModalOpen: tokensModalStore.isOpen,
    isTokensQuantityOk,
    closeTokensModal,
    tokensQuantityInfoParams: {
      tokensQuantityStatus,
      minQuantity,
      maxQuantity
    },
    headerProps: {
      tabsProps,

      search,
      tokenIdValue,
      showTokenIdInput,
      handeTokensSearchChange,
      handleTokenIdChange,
      handleIncrement,
      handleDecrement
    }
  };
};
