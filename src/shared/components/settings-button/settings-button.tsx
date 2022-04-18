import { FC } from 'react';

import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { SettingsIcon } from '@shared/svg';
import { DataTestAttribute } from '@tests/types';

import { Button } from '../button';
import styles from './settings-button.module.scss';

interface Props extends DataTestAttribute {
  className?: string;
  colored?: boolean;
}

export const SettingsButton: FC<Props> = ({ className, colored, testId }) => {
  const { openSettingsModal } = useGlobalModalsState();

  return (
    <Button
      className={className}
      textClassName={styles.flex}
      theme="quaternary"
      onClick={openSettingsModal}
      testId="settingsButton"
    >
      <SettingsIcon colored={colored} />
    </Button>
  );
};
