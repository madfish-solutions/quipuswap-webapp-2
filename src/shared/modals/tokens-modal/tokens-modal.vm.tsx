import { SyntheticEvent, useCallback, useEffect, useMemo } from 'react';

import cx from 'classnames';

import { SINGLE_TOKEN_VALUE } from '@config/constants';
import { Button } from '@shared/components';
import { isEmptyArray, isEqual } from '@shared/helpers';
import { useBaseFilterStoreConverter } from '@shared/hooks';
import { useTokensManagerStore } from '@shared/hooks/use-tokens-manager-store';
import { Token } from '@shared/types';
import { isValidContractAddress } from '@shared/validators';
import { i18n } from '@translation';

import { chosenTokenFirstPredicate } from './chosen-token-first-predicate.helper';
import { ManagedTokensModalCellProps, TokensModalCellProps, TokensQuantityInfo } from './components';
import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import styles from './tokens-modal.module.scss';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();
  const {
    minQuantity,
    maxQuantity,
    tokensQuantityStatus,
    isTokensQuantityOk,
    chosenTokens,
    extendTokens,
    cancelButtonProps,
    confirmButtonProps
  } = tokensModalStore;
  const {
    className: confirmButtonClassName,
    children: confirmButtonChildren,
    ...restConfirmButtonProps
  } = confirmButtonProps ?? {};

  const tokensQuantityInfoParams = {
    minQuantity,
    maxQuantity,
    tokensQuantityStatus
  };

  const tokensManagerStore = useTokensManagerStore();

  const handleTokenClick = useCallback(
    (token: Token) => {
      if (isEqual(maxQuantity, SINGLE_TOKEN_VALUE)) {
        tokensModalStore.setChooseToken(token);
      } else {
        tokensModalStore.toggleChosenToken(token);
      }
    },
    [maxQuantity, tokensModalStore]
  );

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

  const tokensModalCellParams: TokensModalCellProps[] = useMemo(
    () =>
      Array.from(extendTokens)
        .sort(chosenTokenFirstPredicate(chosenTokens ?? []))
        .map(token => ({
          token,
          balance: null,
          onTokenClick: () => handleTokenClick(token)
        })),
    [chosenTokens, extendTokens, handleTokenClick]
  );

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

  const preventFocusToParent = (e: SyntheticEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return {
    isSearching,
    setTokens,
    tokensModalCellParams,
    managedTokensModalCellParams,
    isModalOpen: tokensModalStore.isOpen,
    closeTokensModal,
    tokensModalFooter: !isEqual(maxQuantity, SINGLE_TOKEN_VALUE) && (
      <div className={styles.footerContent}>
        <TokensQuantityInfo {...tokensQuantityInfoParams} />
        <div className={styles.buttonsContainer}>
          {cancelButtonProps && <Button {...cancelButtonProps} onClick={closeTokensModal} />}
          <Button
            {...restConfirmButtonProps}
            disabled={!isTokensQuantityOk}
            className={cx(styles.button, confirmButtonClassName)}
            onClick={setTokens}
          >
            {confirmButtonChildren ?? i18n.t('common|select')}
          </Button>
        </div>
      </div>
    ),
    headerProps: {
      tabsProps,

      search,
      tokenIdValue,
      showTokenIdInput,
      handeTokensSearchChange,
      handleTokenIdChange,
      handleIncrement,
      handleDecrement,
      handleSearchInputClick: preventFocusToParent,
      handleTokenIdInputClick: preventFocusToParent,
      handleSearchInputKeyPress: preventFocusToParent,
      handleTokenIdInputKeyPress: preventFocusToParent
    }
  };
};
