import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { Modal } from '@shared/modals';
import { StakeIcon } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './confirmation-modal.module.scss';
import { useConfirmationModal } from './use-confirmation-modal';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const ConfirmationModal: FC = () => {
  const { t } = useTranslation(['common', 'farm']);
  const {
    message,
    title,
    yesCallback,
    noCallback,
    confirmationModalOpen,
    closeConfirmationModal,
    yesButtonText,
    noButtonText
  } = useConfirmationModal();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.modal, modeClass[colorThemeMode]);

  const onYesClick = () => {
    yesCallback();
    closeConfirmationModal();
  };

  const onNoClick = () => {
    noCallback();
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
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{message}</div>
      <div className={styles.buttons}>
        <Button theme="secondary" onClick={onNoClick}>
          {noButtonText}
        </Button>
        <Button onClick={onYesClick}>{yesButtonText}</Button>
      </div>
    </Modal>
  );
};
