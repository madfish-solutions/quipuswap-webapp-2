import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'next-i18next';

import { useAddCustomToken, useTokens } from '@utils/dapp';
import { debounce } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { Modal } from '@components/ui/Modal';
import { TokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Pen } from '@components/svg/Pen';
import Search from '@icons/Search.svg';

import s from './TokensModal.module.sass';

type TokensModalProps = {
  onChange: (token: WhitelistedToken) => void
} & ReactModal.Props;

export const TokensModal: React.FC<TokensModalProps> = ({
  onChange,
  ...props
}) => {
  const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [filteredTokens, setFilteredTokens] = React.useState<WhitelistedToken[]>([]);
  const handleInputChange = (state: any) => setInputValue(state.target.value);

  const tokens = useTokens();

  const debouncedFilter = debounce(
    () => {
      const buff = tokens.filter(
        ({
          metadata,
          contractAddress,
        }) => metadata.name.toLowerCase().includes(inputValue.toLowerCase())
      || contractAddress.toLowerCase().includes(inputValue.toLowerCase())
      || metadata.symbol.toLowerCase().includes(inputValue.toLowerCase()),
      );
      if (buff.length === 0 && inputValue.length > 0) {
        // ex KT1JkoE42rrMBP9b2oDhbx6EUr26GcySZMUH
        // ex KT1AxaBxkFLCUi3f8rdDAAxBKHfzY8LfKDRA
        addCustomToken(inputValue);
      }
      setFilteredTokens(buff);
    },
    1000,
  );

  useEffect(() => { debouncedFilter(); }, [inputValue, tokens, debouncedFilter]);

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
      {filteredTokens.map((token) => {
        const {
          contractAddress, type, fa2TokenId, metadata: { thumbnailUri, symbol, name },
        } = token;
        return (
          <div aria-hidden key={`${contractAddress}_${fa2TokenId ?? 0}`} onClick={() => onChange(token)}>
            <TokenCell
              contractAddress={`${contractAddress}_${fa2TokenId ?? 0}`}
              icon={thumbnailUri}
              symbol={symbol}
              name={name}
              badges={type.toLowerCase() === 'fa1.2' ? ['FA 1.2'] : ['FA 2.0', `ID: ${fa2TokenId}`]}
            />
          </div>
        );
      })}
    </Modal>
  );
};
