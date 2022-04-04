import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { StakeIcon } from '@components/svg/Sidebar/StakeIcon';
import { Button } from '@components/ui/elements/button';

import { Modal } from '../Modal';
import styles from './confirmation-modal.module.scss';
import { useConfirmationModal } from './use-confirmation-modal';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const ConfirmationModal: FC = () => {
  const { t } = useTranslation(['common']);
  const { message, yesCallback, confirmationModalOpen, closeConfirmationModal } = useConfirmationModal();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.modal, modeClass[colorThemeMode]);

  const onYesClick = () => {
    yesCallback();
    closeConfirmationModal();
  };

  return (
    <Modal
      className={styles.modal}
      portalClassName={styles.modalPortal}
      title={t('common|confirmation')}
      contentClassName={compoundClassName}
      isOpen={confirmationModalOpen}
      onRequestClose={closeConfirmationModal}
    >
      <StakeIcon className={styles.stakeIcon} />
      <div className={styles.title}>{t('common|areYouSure')}</div>
      <div className={styles.description}>{message}</div>
      <div className={styles.buttons}>
        <Button theme="secondary" onClick={closeConfirmationModal}>
          {t('common|no')}
        </Button>
        <Button onClick={onYesClick}>{t('common|yes')}</Button>
      </div>
    </Modal>
  );
};
