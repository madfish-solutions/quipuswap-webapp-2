import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

import s from './NetworkModal.module.sass';

type ComplexRecipientProps = {
} & ReactModal.Props;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NetworkModal: React.FC<ComplexRecipientProps> = ({
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
      title={t('common:Add Network')}
      {...props}
    >
      <Input
        className={s.input}
        value={name}
        label={t('common:Name')}
        onChange={(ev:any) => setName(ev.target.value)}
        placeholder={t('common:My custom network')}
      />
      <Input
        className={s.input}
        value={rpc}
        label={t('common:RPC base URL')}
        onChange={(ev:any) => setRPC(ev.target.value)}
        placeholder={t('common:http://localhost:2000')}
      />
      <Input
        className={s.input}
        value={lambda}
        label={t('common:Lambda View contract(optional)')}
        onChange={(ev:any) => setLambda(ev.target.value)}
        placeholder={t('common:e.g. Kscwf2r3...')}
      />
      <Button
        theme="primary"
        className={s.button}
      >
        {t('common:Add')}
      </Button>
    </Modal>
  );
};
