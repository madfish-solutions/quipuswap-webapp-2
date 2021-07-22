import React, { useEffect, useMemo } from 'react';
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
  const [inputToken, setInputToken] = React.useState<string>('');
  const [filteredTokens, setFilteredTokens] = React.useState<WhitelistedToken[]>([]);
  const handleInputChange = (state: any) => setInputValue(state.target.value);
  const handleTokenChange = (state: any) => setInputToken(state.target.value);

  const tokens = useTokens();

  console.log(tokens);

  const oldInput = useMemo(() => inputValue, [inputValue]);
  const oldInputToken = useMemo(() => inputToken, [inputToken]);

  const debouncedFilter = debounce(
    () => {
      const buff = tokens.filter(
        ({
          metadata,
          contractAddress,
          fa2TokenId,
        }) => {
          const isName = metadata.name.toLowerCase().includes(oldInput.toLowerCase());
          const isSymbol = metadata.symbol.toLowerCase().includes(oldInput.toLowerCase());
          const isContract = contractAddress.toLowerCase().includes(oldInput.toLowerCase());
          if (fa2TokenId || oldInputToken.length > 0) {
            let isFa2 = fa2TokenId === parseInt(oldInputToken, 10);
            if (!oldInputToken) isFa2 = true;
            const res = ((isName
              || isSymbol
              || isContract)
              && isFa2);
            return res;
          }
          const res = (isName
            || isSymbol
            || isContract);
          // console.log(res);
          return res;
        },
      );
      // console.log(buff);
      if (buff.length === 0 && oldInput.length > 0) {
        // console.log(oldInput, parseInt(oldInputToken, 10));
        // ex KT1JkoE42rrMBP9b2oDhbx6EUr26GcySZMUH fa1.2
        // ex KT1AxaBxkFLCUi3f8rdDAAxBKHfzY8LfKDRA fa1.2
        // ex KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd fa2
        addCustomToken(oldInput, parseInt(oldInputToken, 10));
      }
      // console.log(buff, oldInput.toLowerCase(), inputValue.toLowerCase());
      setFilteredTokens(buff);
    },
    1000,
  );

  useEffect(() => {
    // console.log(oldInput, oldInputToken);
    debouncedFilter();
  }, [oldInput, tokens, oldInputToken]);

  const isSoleFa2Token = useMemo(
    () => filteredTokens.find((x) => x.contractAddress === inputValue)?.type === 'fa2', [filteredTokens, inputValue],
  );

  console.log(filteredTokens);

  return (
    <Modal
      title={t('common:Search token')}
      header={(
        <div className={s.inputs}>
          <Input
            StartAdornment={Search}
            className={s.modalInput}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t('common:Search')}
          />
          {(isSoleFa2Token || !!inputToken) && (
          <Input
            EndAdornment={Search}
            className={s.modalInput}
            value={inputToken}
            onChange={handleTokenChange}
            placeholder={t('common:Token ID')}
          />
          )}
        </div>
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
