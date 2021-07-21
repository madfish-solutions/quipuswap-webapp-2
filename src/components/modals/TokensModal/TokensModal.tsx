import React from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'next-i18next';

import { useTokens } from '@utils/dapp';
import { Modal } from '@components/ui/Modal';
import { TokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Pen } from '@components/svg/Pen';
import Search from '@icons/Search.svg';

import { debounce } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import s from './TokensModal.module.sass';

export const TokensModal: React.FC<ReactModal.Props> = ({
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const [inputValue, setInputValue] = React.useState<string>('');
  const handleInputChange = (state: any) => setInputValue(state.target.value);

  const tokens = useTokens();

  const filteredTokens = React.useRef<WhitelistedToken[]>([]);

  React.useMemo(() => {
    const debouncedFilter = debounce(() => {
      filteredTokens.current = tokens.filter(
        ({
          metadata,
          contractAddress,
        }) => metadata.name.toLowerCase().includes(inputValue.toLowerCase())
        || contractAddress.toLowerCase().includes(inputValue.toLowerCase())
        || metadata.symbol.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }, 1000);
    debouncedFilter();
  }, [inputValue, tokens]);

  return (
    <Modal
      title={t('common:Search token')}
      header={(
        <Input
          StartAdornment={Search}
          className={s.modalInput}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search"
        />
      )}
      footer={(
        <Button className={s.modalButton} theme="inverse">
          Manage Lists
          <Pen className={s.penIcon} />

        </Button>
      )}
      {...props}
    >
      {filteredTokens.current.map(({
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
