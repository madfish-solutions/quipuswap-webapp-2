import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Button } from '@shared/components/button';
import { useGlobalModalsState } from '@shared/hooks/use-global-modals-state';

import styles from './donation-button.module.sass';

interface DonationButtonProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DonationButton: React.FC<DonationButtonProps> = ({ className }) => {
  const { openDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Button
      className={cx(styles.button, modeClass[colorThemeMode], className)}
      onClick={openDonationModal}
      theme="secondary"
    >
      <span>{t('common|Support')}</span>
      <img src="/ukraine_outline.png" alt="Ukraine" className={styles.ukraineOutline} />
    </Button>
  );
};
