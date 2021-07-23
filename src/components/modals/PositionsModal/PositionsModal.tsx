import React, { useEffect, useMemo } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { useAddCustomToken, useNetwork, useTokens } from '@utils/dapp';
import { debounce, searchToken } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { Modal } from '@components/ui/Modal';
import { PositionCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import Search from '@icons/Search.svg';

import { TEZ_TOKEN } from '@utils/defaults';
import s from './PositionsModal.module.sass';

type PositionsModalProps = {
  onChange: (token: WhitelistedTokenPair) => void
} & ReactModal.Props;

export const PositionsModal: React.FC<PositionsModalProps> = ({
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
  const network = useNetwork();
  // ex lp KT1P3RGEAa78XLTs3Hkpd1VWtryQRLDjiXqF

  const oldInput = useMemo(() => inputValue, [inputValue]);
  const oldInputToken = useMemo(() => inputToken, [inputToken]);

  const debouncedFilter = debounce(
    () => {
      const buff = ([...tokens, TEZ_TOKEN] as WhitelistedToken[]).filter(
        (token) => searchToken(token, network, oldInput, oldInputToken),
      );
      if (buff.length === 0 && oldInput.length > 0) {
        addCustomToken(oldInput, parseInt(oldInputToken, 10));
      }
      setFilteredTokens(buff);
    },
    1000,
  );

  useEffect(() => {
    debouncedFilter();
  }, [oldInput, tokens, network, oldInputToken]);

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
          {(inputValue.length > 0 || !!inputToken) && (
          <Input
            EndAdornment={Search}
            className={cx(s.modalInput, s.secretInput)}
            value={inputToken}
            onChange={handleTokenChange}
            placeholder={t('common:Search')}
          />
          )}
        </div>
      )}
      {...props}
    >
      {filteredTokens.map((token) => (
        <div
          aria-hidden
          key={`${token.contractAddress}_${token.fa2TokenId ?? 0}`}
          onClick={() => onChange({ token1: token, token2: token } as WhitelistedTokenPair)}
        >
          <PositionCell
            tokenPair={{ token1: token, token2: token } as WhitelistedTokenPair}
          />
        </div>
      ))}
    </Modal>
  );
};
