import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';

import { Copy, Modal, Button, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { noop } from 'rxjs';

import { appi18n } from '@app.i18n';
import { CheckMark } from '@components/svg/CheckMark';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { useAccountPkh, useDisconnect } from '@utils/dapp';
import { shortize } from '@utils/helpers';

import s from './AccountModal.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const AccountModal: React.FC = () => {
  const { t } = appi18n;
  const accountPkh = useAccountPkh();
  const disconnect = useDisconnect();
  const [copied, setCopied] = useState<boolean>(false);

  const { accountInfoModalOpen, closeAccountInfoModal } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const timeout = useRef(setTimeout(noop, 0));

  const handleLogout = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  if (!accountPkh) {
    return <></>;
  }

  const compoundClassName = cx(s.modal, modeClass[colorThemeMode]);

  const handleCopy = async () => {
    navigator.clipboard.writeText(accountPkh);
    setCopied(true);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Modal
      contentClassName={compoundClassName}
      title={t('common|Account')}
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
          control={copied ? <CheckMark className={s.icon} /> : <Copy className={s.icon} />}
        >
          {copied ? t('swap|Copied') : t('swap|Copy')}
        </Button>
      </div>
      <Button className={s.button} theme="secondary" onClick={handleLogout}>
        {t('common|Log Out')}
      </Button>
    </Modal>
  );
};
