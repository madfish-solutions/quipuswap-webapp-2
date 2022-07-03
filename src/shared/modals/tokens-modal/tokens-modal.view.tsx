import { FC } from 'react';

import { Button, Iterator, ManagedTokensModalCell, Tabs } from '@shared/components';
import { TokensModalCell } from '@shared/components/tokens-modal-cell';

import { Modal } from '../modal';
import styles from './tokens-modal.module.scss';
import { TokensModalViewProps } from './types';

export const TokensModalView: FC<TokensModalViewProps> = ({
  setTokens,
  isModalOpen,
  closeTokensModal,
  tokensModalCellParams,
  managedTokensModalCellParams,
  tabsProps
}) => {
  return (
    <Modal
      cardClassName={styles.modalCard}
      title={'Serch Tokens'}
      isOpen={isModalOpen}
      onRequestClose={closeTokensModal}
      header={<Tabs {...tabsProps} />}
    >
      {tabsProps.activeId === 'tokens' && (
        <>
          <Iterator render={TokensModalCell} data={tokensModalCellParams} />
          <Button onClick={setTokens}>Click Me</Button>
        </>
      )}
      {tabsProps.activeId === 'manage' && (
        <Iterator render={ManagedTokensModalCell} data={managedTokensModalCellParams} />
      )}
    </Modal>
  );
};
