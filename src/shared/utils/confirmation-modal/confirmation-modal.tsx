import { FC, useContext } from 'react';

import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { Modal } from '@shared/modals';
import { StakeIcon } from '@shared/svg';

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
      portalClassName={styles.modal}
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
