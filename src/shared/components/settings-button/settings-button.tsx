import { FC } from 'react';

import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { SettingsIcon } from '@shared/svg';

import { amplitudeService } from '../../services';
import { Button } from '../button';
import styles from './settings-button.module.scss';

interface Props {
  className?: string;
}

export const SettingsButton: FC<Props> = ({ className }) => {
  const { openSettingsModal } = useGlobalModalsState();

  const handleSettingsClick = () => {
    openSettingsModal();
    amplitudeService.logEvent('SETTINGS_BUTTON_CLICK');
  };

  return (
    <Button className={className} textClassName={styles.flex} theme="quaternary" onClick={handleSettingsClick}>
      <SettingsIcon />
    </Button>
  );
};
