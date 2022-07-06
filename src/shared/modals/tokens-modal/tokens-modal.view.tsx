import { FC, useMemo } from 'react';

import { Button, Iterator, Skeleton } from '@shared/components';
import { TokensModalCell } from '@shared/components/tokens-modal-cell';
import { i18n } from '@translation';

import { Modal } from '../modal';
import { ManagedTokensModalCell, TokensModalHeader } from './components';
import { TokensModalTab } from './tokens-modal-tabs.service';
import styles from './tokens-modal.module.scss';
import { TokensModalViewProps } from './types';

export const TokensModalView: FC<TokensModalViewProps> = ({
  isSearching,
  setTokens,
  isModalOpen,
  closeTokensModal,
  tokensModalCellParams,
  managedTokensModalCellParams,
  headerProps
}) => {
  const { footer, content } = useMemo(() => {
    switch (headerProps.tabsProps.activeId) {
      case TokensModalTab.TOKENS:
        return {
          footer: (
            <Button className={styles.button} onClick={setTokens}>
              {i18n.t('common|select')}
            </Button>
          ),
          content: <Iterator render={TokensModalCell} data={tokensModalCellParams} />
        };
      case TokensModalTab.MANAGE:
        return {
          footer: null,
          content: <Iterator render={ManagedTokensModalCell} data={managedTokensModalCellParams} />
        };
      default:
        return {
          footer: null,
          content: null
        };
    }
  }, [headerProps.tabsProps.activeId, managedTokensModalCellParams, setTokens, tokensModalCellParams]);

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
