import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Copy } from '@components/svg/Copy';

import s from './AccountModal.module.sass';

type ComplexRecipientProps = {
  address:string
} & ReactModal.Props;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const AccountModal: React.FC<ComplexRecipientProps> = ({
  address,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.modal,
    modeClass[colorThemeMode],
  );

  const handleCopy = async () => navigator.clipboard.writeText(address);

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={compoundClassName}
      title={t('common:Account')}
      {...props}
    >
      <div className={s.row}>
        <div className={s.addr}>
          tz1TryFD...KGdK
        </div>
        <Button
          onClick={handleCopy}
          theme="inverse"
        >
          <div className={s.buttonContent}>
            <Copy className={s.icon} />
            {t('swap:Copy')}

          </div>
        </Button>
      </div>
      <Button
        className={s.button}
        theme="secondary"
      >
        {t('common:Log Out')}
      </Button>
    </Modal>
  );
};
