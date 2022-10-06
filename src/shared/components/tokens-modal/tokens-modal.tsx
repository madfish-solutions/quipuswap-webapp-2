import { FC, useContext } from 'react';

import cx from 'classnames';
import { Props } from 'react-modal';

import { MOCK_LOADING_ARRAY } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { getTokenSlug } from '@shared/helpers';
import { Modal } from '@shared/modals';
import { NotFound } from '@shared/svg';
import { Token } from '@shared/types';

import { Iterator } from '../iterator';
import { LoadingTokenCell, TokenCell } from '../modal-cell';
import { Header } from './header';
import styles from './tokens-modal.module.scss';
import { useTokensModalViewModel } from './tokens-modal.vm';

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
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
          values={values}
        />
      }
      className={themeClass[colorThemeMode]}
      modalClassName={styles.tokenModal}
      containerClassName={styles.tokenModal}
      cardClassName={cx(styles.tokenModal, styles.maxHeight)}
      contentClassName={cx(styles.tokenModal)}
      {...restProps}
    >
      {isTokensNotFound && (
        <div className={styles.tokenNotFound}>
          <NotFound />
          <div className={styles.notFoundLabel}>{notFoundLabel}</div>
        </div>
      )}
      {isTokensLoading && <Iterator data={MOCK_LOADING_ARRAY} render={LoadingTokenCell} />}
      <Iterator
        data={allTokens}
        keyFn={getTokenSlug}
        render={token => (
          <TokenCell key={getTokenSlug(token)} token={token} tabIndex={0} onClick={() => handleTokenSelect(token)} />
        )}
      />
    </Modal>
  );
};
