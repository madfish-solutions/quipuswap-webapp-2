import { FC } from 'react';

import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { SettingsIcon } from '@shared/svg';

import { Button } from '../button';
import styles from './settings-button.module.scss';

interface Props {
  className?: string;
}

export const SettingsButton: FC<Props> = ({ className }) => {
  const { openSettingsModal } = useGlobalModalsState();

  return (
    <Button
      className={className}
      testId="hSettingsButton"
      textClassName={styles.flex}
      theme="quaternary"
      onClick={openSettingsModal}
    >
      <SettingsIcon />
    </Button>
  );
};
