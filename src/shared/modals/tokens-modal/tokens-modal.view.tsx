import { FC, useMemo } from 'react';

import { Button, Iterator, Skeleton } from '@shared/components';
import { i18n } from '@translation';

import { Modal } from '../modal';
import { ManagedTokensModalCell, TokensModalCell, TokensModalHeader, TokensQuantityInfo } from './components';
import { TokensModalTab } from './tokens-modal-tabs.service';
import styles from './tokens-modal.module.scss';
import { TokensModalViewProps } from './types';

export const TokensModalView: FC<TokensModalViewProps> = ({
  isSearching,
  setTokens,
  isModalOpen,
  closeTokensModal,
  isTokensQuantityOk,
  tokensModalCellParams,
  managedTokensModalCellParams,
  headerProps,
  tokensQuantityInfoParams
}) => {
  const { footer, content } = useMemo(() => {
    switch (headerProps.tabsProps.activeId) {
      case TokensModalTab.TOKENS:
        return {
          footer: (
            <div className={styles.footerContent}>
              <TokensQuantityInfo {...tokensQuantityInfoParams} />
              <Button disabled={!isTokensQuantityOk} className={styles.button} onClick={setTokens}>
                {i18n.t('common|select')}
              </Button>
            </div>
          ),
          content: <Iterator render={TokensModalCell} data={tokensModalCellParams} />
        };
      case TokensModalTab.MANAGE:
        return {
          footer: null,
          content: <Iterator render={ManagedTokensModalCell} data={managedTokensModalCellParams} />
        };
    }
  }, [
    headerProps.tabsProps.activeId,
    isTokensQuantityOk,
    managedTokensModalCellParams,
    setTokens,
    tokensModalCellParams,
    tokensQuantityInfoParams
  ]);

  return (
    <Modal
      cardClassName={styles.modalCard}
      contentClassName={styles.modalContent}
      title={i18n.t('common|Search token')}
      isOpen={isModalOpen}
      onRequestClose={closeTokensModal}
      header={<TokensModalHeader tabsClassName={styles.tabs} inputsClassName={styles.inputs} {...headerProps} />}
      footer={footer}
    >
      {isSearching && <Skeleton className={styles.skeleton} />}
      {content}
    </Modal>
  );
};
