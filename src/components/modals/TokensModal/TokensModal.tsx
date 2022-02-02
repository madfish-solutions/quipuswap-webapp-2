import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ColorModes, ColorThemeContext, LoadingTokenCell, Modal, TokenCell, TokenNotFound } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { withTypes } from 'react-final-form';
import ReactModal from 'react-modal';

import { NETWORK } from '@app.config';
import { Standard } from '@graphql';
import {
  useTezos,
  getTokenType,
  useAddCustomToken,
  useSearchCustomTokens,
  useSearchTokens,
  useTokens
} from '@utils/dapp';
import { getTokenName, getTokenSymbol, isTokenEqual, localSearchToken, prepareTokenLogo } from '@utils/helpers';
import { getStandardValue } from '@utils/helpers/token.standard';
import { Token } from '@utils/types';

import { AutoSave } from './AutoSave';
import s from './TokensModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

// eslint-disable-next-line import/no-named-as-default-member
interface TokensModalProps extends ReactModal.Props {
  onChange: (token: Token) => void;
  blackListedTokens: Token[];
}

interface FormValues {
  search: string;
  tokenId: number | string;
}

export const TokensModal: React.FC<TokensModalProps> = ({ onChange, blackListedTokens = [], ...props }) => {
  const addCustomToken = useAddCustomToken();
  const searchCustomToken = useSearchCustomTokens();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const tezos = useTezos();
  const { Form } = withTypes<FormValues>();
  const { data: tokens, loading: tokensLoading } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputToken, setInputToken] = useState<number>(0);
  const [isSoleFa2Token, setSoleFa2Token] = useState<boolean>(false);

  const handleInput = (values: FormValues) => {
    setInputValue(values.search ?? '');
    setInputToken(isSoleFa2Token ? Number(values.tokenId) : 0);
  };

  const handleTokenSearch = useCallback(() => {
    if (!tezos) {
      return;
    }
    // eslint-disable-next-line
    const isTokens = tokens.filter((token: any) => localSearchToken(token, NETWORK, inputValue, inputToken));
    setFilteredTokens(isTokens);
    if (inputValue.length > 0 && isTokens.length === 0) {
      searchCustomToken(inputValue, inputToken);
    }
  }, [inputValue, inputToken, tezos, searchCustomToken, tokens]);

  const isEmptyTokens = useMemo(
    () => filteredTokens.length === 0 && searchTokens.length === 0,
    [searchTokens, filteredTokens]
  );

  useEffect(() => handleTokenSearch(), [tokens, inputValue, inputToken, handleTokenSearch]);

  const allTokens = useMemo(
    () =>
      (inputValue.length > 0 && filteredTokens.length === 0 ? searchTokens : filteredTokens).filter(
        x => !blackListedTokens.find(y => isTokenEqual(x, y))
      ),
    [inputValue, filteredTokens, searchTokens, blackListedTokens]
  );

  useEffect(() => {
    getTokenType(inputValue, tezos!).then(tokenType => setSoleFa2Token(tokenType === Standard.Fa2));
  }, [inputValue, tezos]);

  const handleTokenSelect = (form: FormApi<FormValues>, token: Token) => {
    onChange(token);
    if (searchTokens.length > 0) {
      addCustomToken(token);
    }
    form.mutators.setValue('search', '');
    form.mutators.setValue('tokenId', 0);
    setInputValue('');
    setInputToken(0);
  };

  return (
    <Form
      onSubmit={handleInput}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        }
      }}
      render={({ form }) => (
        <Modal
          title={t('common|Search token')}
          header={<AutoSave form={form} save={handleInput} isSecondInput={isSoleFa2Token} />}
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          {...props}
        >
          {isEmptyTokens && !searchLoading && !tokensLoading && (
            <div className={s.tokenNotFound}>
              <TokenNotFound />
              <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>{' '}
            </div>
          )}
          {isEmptyTokens &&
            (searchLoading || tokensLoading) &&
            [1, 2, 3, 4, 5, 6, 7].map(x => <LoadingTokenCell key={x} />)}
          {allTokens.map(token => {
            const { contractAddress, fa2TokenId, metadata, type } = token;

            return (
              <TokenCell
                key={`${contractAddress}_${fa2TokenId ?? 0}`}
                tokenIcon={prepareTokenLogo(metadata?.thumbnailUri)}
                tokenName={getTokenName(token)}
                tokenSymbol={getTokenSymbol(token)}
                tokenType={getStandardValue(type)}
                tabIndex={0}
                onClick={() => handleTokenSelect(form, token)}
              />
            );
          })}
        </Modal>
      )}
    />
  );
};
