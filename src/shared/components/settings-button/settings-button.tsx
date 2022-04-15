import { FC } from 'react';

import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { SettingsIcon } from '@shared/svg';

import { Button } from '../button';
import styles from './settings-button.module.scss';

interface Props {
  className?: string;
  colored?: boolean;
}

export const SettingsButton: FC<Props> = ({ className, colored }) => {
  const { openSettingsModal } = useGlobalModalsState();

  return (
<<<<<<< HEAD
    <Button
      className={className}
      testId="hSettingsButton"
      textClassName={styles.flex}
      theme="quaternary"
      onClick={openSettingsModal}
    >
      <SettingsIcon />
=======
    <Button className={className} textClassName={styles.flex} theme="quaternary" onClick={openSettingsModal}>
      <SettingsIcon colored={colored} />
>>>>>>> 3fe7e792869f74fc2bb4713a2b8b0ee59a05cc4c
    </Button>
  );
};
