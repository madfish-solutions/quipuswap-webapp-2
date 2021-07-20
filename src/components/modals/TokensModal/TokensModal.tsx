import React from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'next-i18next';

import { useTokens } from '@utils/dapp';
import { Modal } from '@components/ui/Modal';
import { TokenCell } from '@components/ui/Modal/ModalCell';

export const TokensModal: React.FC<ReactModal.Props> = ({
  ...props
}) => {
  const { t } = useTranslation(['common']);

  const tokens = useTokens();

  return (
    <Modal
      title={t('common:Search token')}
      {...props}
    >
      {tokens.map(({
        contractAddress, type, fa2TokenId, metadata: { thumbnailUri, symbol, name },
      }) => (
        <TokenCell
          key={`${contractAddress}_${fa2TokenId ?? 0}`}
          contractAddress={`${contractAddress}_${fa2TokenId ?? 0}`}
          icon={thumbnailUri}
          symbol={symbol}
          name={name}
          badges={type.toLowerCase() === 'fa1.2' ? ['FA 1.2'] : ['FA 2.0', `ID: ${fa2TokenId}`]}
        />
      ))}
    </Modal>
  );
};
