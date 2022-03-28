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
      portalClassName={styles.modal}
      title={t('common|Confirmation')}
      contentClassName={compoundClassName}
      isOpen={confirmationModalOpen}
      onRequestClose={closeConfirmationModal}
    >
      <StakeIcon className={styles.stakeIcon} />
      <div className={styles.title}>Are you sure?</div>
      <div className={styles.description}>{message}</div>
      <div className={styles.buttons}>
        <Button theme="secondary" onClick={closeConfirmationModal}>
          {t('common| No')}
        </Button>
        <Button onClick={onYesClick}>{t('common| Yes')}</Button>
      </div>
    </Modal>
  );
};
