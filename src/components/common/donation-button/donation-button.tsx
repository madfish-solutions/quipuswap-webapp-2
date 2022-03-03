import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Button } from '@components/ui/elements/button';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';

import styles from './donation-button.module.sass';

interface DonationButtonProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DonationButton: React.FC<DonationButtonProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { openDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Button
      className={cx(styles.button, modeClass[colorThemeMode], className)}
      onClick={openDonationModal}
      theme="secondary"
    >
      <div className={styles.contentWrapper}>
        {t('common|Support')}
        <img src="/ukraine_outline.png" alt="Ukraine" className={styles.ukraineOutline} />
      </div>
    </Button>
  );
};
