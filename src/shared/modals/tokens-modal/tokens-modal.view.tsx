import { FC, useContext, useMemo } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Iterator, Skeleton } from '@shared/components';
import { i18n } from '@translation';

import { ManagedTokensModalCell, TokensModalCell, TokensModalHeader } from './components';
import { TokensModalTab } from './tokens-modal-tabs.service';
import styles from './tokens-modal.module.scss';
import { TokensModalViewProps } from './types';
import { Modal } from '../modal';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TokensModalView: FC<TokensModalViewProps> = ({
  isSearching,
  isModalOpen,
  closeTokensModal,
  tokensModalCellParams,
  managedTokensModalCellParams,
  tokensModalFooter,
  headerProps
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const { footer, content } = useMemo(() => {
    switch (headerProps.tabsProps.activeId) {
      case TokensModalTab.TOKENS:
        return {
          footer: tokensModalFooter,
          content: <Iterator render={TokensModalCell} data={tokensModalCellParams} />
        };
      case TokensModalTab.MANAGE:
        return {
          footer: null,
          content: <Iterator render={ManagedTokensModalCell} data={managedTokensModalCellParams} />
        };
    }
  }, [headerProps.tabsProps.activeId, managedTokensModalCellParams, tokensModalCellParams, tokensModalFooter]);

  return (
    <Modal
      cardClassName={styles.modalCard}
      contentClassName={styles.modalContent}
      title={i18n.t('common|Search token')}
      isOpen={isModalOpen}
      onRequestClose={closeTokensModal}
      header={
        <TokensModalHeader
          tabsClassName={cx(styles.tabs, modeClass[colorThemeMode])}
          inputsClassName={styles.inputs}
          {...headerProps}
        />
      }
      footer={footer}
    >
      {isSearching && <Skeleton className={styles.skeleton} />}
      {content}
    </Modal>
  );
};
