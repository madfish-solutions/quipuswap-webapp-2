import React, { useEffect, useMemo } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import {
  mergeTokensToPair, useNetwork, useTokens,
} from '@utils/dapp';
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
  // const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [inputToken, setInputToken] = React.useState<string>('');
  const [filteredTokens, setFilteredTokens] = React.useState<WhitelistedTokenPair[]>([]);
  const handleInputChange = (state: any) => setInputValue(state.target.value);
  const handleTokenChange = (state: any) => setInputToken(state.target.value);

  const tokens = useTokens();
  const network = useNetwork();
  // ex lp KT1P3RGEAa78XLTs3Hkpd1VWtryQRLDjiXqF

  const oldInput1 = useMemo(() => inputValue, [inputValue]);
  const oldInput2 = useMemo(() => inputToken, [inputToken]);

  const debouncedFilter = debounce(
    () => {
      const buff = ([...tokens, TEZ_TOKEN] as WhitelistedToken[]).filter(
        (token) => searchToken(token, network, oldInput1, ''),
      );
      const buff1 = ([...tokens, TEZ_TOKEN] as WhitelistedToken[]).filter(
        (token) => searchToken(token, network, oldInput2, ''),
      );
      // if (buff.length === 0 && oldInput1.length > 0 && buff1.length === 0) {
      //   addCustomToken(oldInput1);
      // }
      setFilteredTokens(mergeTokensToPair(buff, buff1));
    },
    1000,
  );

  useEffect(() => {
    debouncedFilter();
  }, [oldInput1, tokens, network, oldInput2]);

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
            StartAdornment={Search}
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
      {filteredTokens.map((pair) => (
        <div
          aria-hidden
          key={`${pair.token1.contractAddress}_${pair.token1.fa2TokenId ?? 0}`}
          onClick={() => onChange(pair)}
        >
          <PositionCell
            tokenPair={pair}
          />
        </div>
      ))}
    </Modal>
  );
};
