import { FC } from 'react';

import { Button, Iterator, Tabs } from '@shared/components';
import { TokensModalCell } from '@shared/components/tokens-modal-cell';

import { Modal } from '../modal';
import { TokensModalViewProps } from './types';

export const TokensModalView: FC<TokensModalViewProps> = ({
  setTokens,
  isModalOpen,
  closeTokensModal,
  tokens,
  tabsProps
}) => {
  return (
    <Modal
      title={'Serch Tokens'}
      isOpen={isModalOpen}
      onRequestClose={closeTokensModal}
      header={<Tabs {...tabsProps} />}
    >
      <Iterator render={TokensModalCell} data={tokens} />
      <Button onClick={setTokens}>Click Me</Button>
    </Modal>
  );
};
