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
    <Button className={className} textClassName={styles.flex} theme="quaternary" onClick={openSettingsModal}>
      <SettingsIcon colored={colored} />
    </Button>
  );
};
