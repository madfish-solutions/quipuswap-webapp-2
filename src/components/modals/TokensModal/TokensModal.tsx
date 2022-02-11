import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, TokenNotFound } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { withTypes } from 'react-final-form';
import ReactModal from 'react-modal';

import { LoadingTokenCell, Modal, TokenCell } from '@components/modals/Modal';
import { useTokensSearchService } from '@hooks/use-tokens-search.service';
import { useAddCustomToken } from '@utils/dapp';
import { getTokenName, getTokenSymbol, isEmptyArray, prepareTokenLogo } from '@utils/helpers';
import { Token } from '@utils/types';

import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID, MOCK_LOADING_ARRAY } from '../constants';
import { getTokenKey } from '../get-token-key';
import { AutoSave } from './AutoSave';
import s from './TokensModal.module.sass';
import { FormValues, TMFormField } from './types';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

// eslint-disable-next-line import/no-named-as-default-member
interface TokensModalProps extends ReactModal.Props {
  onChange: (token: Token) => void;
  blackListedTokens: Token[];
}

export const TokensModal: FC<TokensModalProps> = ({ onChange, blackListedTokens = [], ...props }) => {
  const addCustomToken = useAddCustomToken();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();

  const { searchTokens, isSoleFa2Token, allTokens, handleInput, isTokensNotFound, isTokensLoading, resetSearchValues } =
    useTokensSearchService<FormValues>(blackListedTokens);

  const handleTokenSelect = (form: FormApi<FormValues>, token: Token) => {
    onChange(token);
    if (!isEmptyArray(searchTokens)) {
      addCustomToken(token);
    }
    form.mutators.setValue(TMFormField.SEARCH, DEFAULT_SEARCH_VALUE);
    form.mutators.setValue(TMFormField.TOKEN_ID, DEFAULT_TOKEN_ID);
    resetSearchValues();
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
          {isTokensNotFound && (
            <div className={s.tokenNotFound}>
              <TokenNotFound />
              <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>{' '}
            </div>
          )}
          {isTokensLoading && MOCK_LOADING_ARRAY.map(x => <LoadingTokenCell key={x} />)}
          {allTokens.map(token => {
            const { metadata, type } = token;

            return (
              <TokenCell
                key={getTokenKey(token)}
                tokenIcon={prepareTokenLogo(metadata?.thumbnailUri)}
                tokenName={getTokenName(token)}
                tokenSymbol={getTokenSymbol(token)}
                tokenType={type}
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
