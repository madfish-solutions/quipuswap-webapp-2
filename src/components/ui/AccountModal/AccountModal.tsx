import React, { useCallback, useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { shortize } from '@utils/helpers';
import { useAccountPkh, useDisconnect } from '@utils/dapp';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Copy } from '@components/svg/Copy';

import s from './AccountModal.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const AccountModal: React.FC = () => {
  const { t } = useTranslation(['common']);
  const accountPkh = useAccountPkh();
  const disconnect = useDisconnect();

  const {
    accountInfoModalOpen,
    closeAccountInfoModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

  const handleLogout = useCallback(() => {
    disconnect();
  }, [disconnect]);

  if (!accountPkh) return <></>;

  const compoundClassName = cx(
    s.modal,
    modeClass[colorThemeMode],
  );

  const handleCopy = async () => navigator.clipboard.writeText(accountPkh);

  return (
    <Modal
      contentClassName={compoundClassName}
      title={t('common:Account')}
      isOpen={accountInfoModalOpen}
      onRequestClose={closeAccountInfoModal}
    >
      <div className={s.row}>
        <div className={s.addr} title={accountPkh}>
          {shortize(accountPkh, 8)}
        </div>
        <Button
          onClick={handleCopy}
          theme="inverse"
          className={s.buttonCopy}
        >
          <Copy className={s.icon} />
          {t('swap:Copy')}
        </Button>
      </div>
      <Button
        className={s.button}
        theme="secondary"
        onClick={handleLogout}
      >
        {t('common:Log Out')}
      </Button>
    </Modal>
  );
};
