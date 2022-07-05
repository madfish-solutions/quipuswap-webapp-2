import { FC } from 'react';

import { Button, Iterator, ManagedTokensModalCell, Skeleton } from '@shared/components';
import { TokensModalCell } from '@shared/components/tokens-modal-cell';

import { Modal } from '../modal';
import { TokensModalHeader } from './tokens-modal-header';
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
  return (
    <Modal
      cardClassName={styles.modalCard}
      contentClassName={styles.modalContent}
      title={'Serch Tokens'}
      isOpen={isModalOpen}
      onRequestClose={closeTokensModal}
      header={<TokensModalHeader tabsClassName={styles.tabs} inputsClassName={styles.inputs} {...headerProps} />}
      footer={headerProps.tabsProps.activeId === 'tokens' && <Button onClick={setTokens}>Click Me</Button>}
    >
      {isSearching && <Skeleton className={styles.skeleton} />}
      {headerProps.tabsProps.activeId === 'tokens' && (
        <>
          <Iterator render={TokensModalCell} data={tokensModalCellParams} />
        </>
      )}
      {headerProps.tabsProps.activeId === 'manage' && (
        <Iterator render={ManagedTokensModalCell} data={managedTokensModalCellParams} />
      )}
    </Modal>
  );
};
