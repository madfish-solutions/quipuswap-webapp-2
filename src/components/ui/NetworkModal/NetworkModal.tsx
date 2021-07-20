import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

import s from './NetworkModal.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NetworkModal: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const {
    networkAddModalOpen,
    closeNetworkAddModal,
  } = useConnectModalsState();

  const [name, setName] = React.useState<string>('');
  const [rpc, setRPC] = React.useState<string>('');
  const [lambda, setLambda] = React.useState<string>('');

  const compoundClassName = cx(
    s.modal,
    modeClass[colorThemeMode],
  );

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={compoundClassName}
      title={t('swap:Add Network')}
      isOpen={networkAddModalOpen}
      onRequestClose={closeNetworkAddModal}
    >
      <Input
        className={s.input}
        value={name}
        label={t('swap:Name')}
        onChange={(ev:any) => setName(ev.target.value)}
        placeholder={t('swap:My custom network')}
      />
      <Input
        className={s.input}
        value={rpc}
        label={t('swap:RPC base URL')}
        onChange={(ev:any) => setRPC(ev.target.value)}
        placeholder={t('swap:http://localhost:2000')}
      />
      <Input
        className={s.input}
        value={lambda}
        label={t('swap:Lambda View contract(optional)')}
        onChange={(ev:any) => setLambda(ev.target.value)}
        placeholder={t('swap:e.g. Kscwf2r3...')}
      />
      <Button
        theme="primary"
        className={s.button}
      >
        {t('swap:Add')}
      </Button>
    </Modal>
  );
};
