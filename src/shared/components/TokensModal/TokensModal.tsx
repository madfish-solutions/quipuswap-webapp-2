import { FC, useContext } from 'react';

import cx from 'classnames';
import { FormApi } from 'final-form';
import { withTypes } from 'react-final-form';
import { Props } from 'react-modal';

import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID, MOCK_LOADING_ARRAY } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAddCustomToken } from '@providers/dapp-tokens';
import {
  getTokenName,
  getTokenSlug,
  getTokenSymbol,
  isEmptyArray,
  isTezosToken,
  prepareTokenLogo
} from '@shared/helpers';
import { Modal } from '@shared/modals';
import { amplitudeService, useTokensSearchService } from '@shared/services';
import { NotFound } from '@shared/svg';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import { LoadingTokenCell, TokenCell } from '../modal-cell';
import { AutoSave } from './AutoSave';
import s from './TokensModal.module.scss';
import { FormValues, TMFormField } from './types';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface TokensModalProps extends Props {
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
      amplitudeService.logEvent('SELECT_TOKEN', { token: getTokenSlug(token), customToken: true });
    } else {
      amplitudeService.logEvent('SELECT_TOKEN', { token: getTokenSlug(token), customToken: false });
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
              <NotFound />
              <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>{' '}
            </div>
          )}
          {isTokensLoading && MOCK_LOADING_ARRAY.map(x => <LoadingTokenCell key={x} />)}
          {allTokens.map(token => {
            const { metadata, type } = token;

            return (
              <TokenCell
                key={getTokenSlug(token)}
                tokenIcon={prepareTokenLogo(metadata?.thumbnailUri)}
                tokenName={getTokenName(token)}
                tokenSymbol={getTokenSymbol(token)}
                isTezosToken={isTezosToken(token)}
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
