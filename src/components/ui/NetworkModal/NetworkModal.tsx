import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import ReactModal from 'react-modal';
import { Button, Input } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';

import s from './NetworkModal.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NetworkModal: React.FC<ReactModal.Props> = ({
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

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
      title={t('common|Add Network')}
      {...props}
    >
      <Input
        className={s.input}
        value={name}
        label={t('common|Name')}
        onChange={(ev:any) => setName(ev.target.value)}
        placeholder={t('common|My custom network')}
        id="networkModal-01"
      />
      <Input
        className={s.input}
        value={rpc}
        label={t('common|RPC base URL')}
        onChange={(ev:any) => setRPC(ev.target.value)}
        placeholder={t('common|http://localhost:2000')}
        id="networkModal-02"
      />
      <Input
        className={s.input}
        value={lambda}
        label={t('common|Lambda View contract(optional)')}
        onChange={(ev:any) => setLambda(ev.target.value)}
        placeholder={t('common|e.g. Kscwf2r3...')}
        id="networkModal-03"
      />
      <Button
        theme="primary"
        className={s.button}
      >
        {t('common|Add')}
      </Button>
    </Modal>
  );
};
