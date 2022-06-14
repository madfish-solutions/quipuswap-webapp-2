import { FC, useContext } from 'react';

import cx from 'classnames';
import { Props } from 'react-modal';

import { MOCK_LOADING_ARRAY } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { getTokenName, getTokenSlug, getTokenSymbol, isTezosToken, prepareTokenLogo } from '@shared/helpers';
import { Modal } from '@shared/modals';
import { NotFound } from '@shared/svg';
import { Token } from '@shared/types';

import { Iterator } from '../iterator';
import { LoadingTokenCell, TokenCell } from '../modal-cell';
import { Header } from './header';
import s from './tokens-modal.module.scss';
import { useTokensModalViewModel } from './tokens-modal.vm';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface TokensModalProps extends Props {
  onChange: (token: Token) => void;
  blackListedTokens: Token[];
}

export const TokensModal: FC<TokensModalProps> = ({ onChange, blackListedTokens, ...restProps }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const {
    allTokens,
    errors,
    handleChange,
    handleTokenSelect,
    isSoleFa2Token,
    isTokensLoading,
    isTokensNotFound,
    modalTitle,
    handleTokenIdDecrement,
    handleTokenIdIncrement,
    notFoundLabel,
    touched,
    values
  } = useTokensModalViewModel({ onChange, blackListedTokens });

  return (
    <Modal
      title={modalTitle}
      header={
        <Header
          errors={errors}
          onChange={handleChange}
          onTokenIdDecrement={handleTokenIdDecrement}
          onTokenIdIncrement={handleTokenIdIncrement}
          isSecondInput={isSoleFa2Token}
          touched={touched}
          values={values}
        />
      }
      className={themeClass[colorThemeMode]}
      modalClassName={s.tokenModal}
      containerClassName={s.tokenModal}
      cardClassName={cx(s.tokenModal, s.maxHeight)}
      contentClassName={cx(s.tokenModal)}
      {...restProps}
    >
      {isTokensNotFound && (
        <div className={s.tokenNotFound}>
          <NotFound />
          <div className={s.notFoundLabel}>{notFoundLabel}</div>{' '}
        </div>
      )}
      {isTokensLoading && MOCK_LOADING_ARRAY.map(x => <LoadingTokenCell key={x} />)}
      <Iterator
        data={allTokens}
        keyFn={getTokenSlug}
        render={token => {
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
              onClick={() => handleTokenSelect(token)}
            />
          );
        }}
      />
    </Modal>
  );
};
