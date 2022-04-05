import { FC, useContext } from 'react';

import cx from 'classnames';

import Ukraine from '@images/ukraine_outline.png';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { useTranslation } from '@translation';

import { Button } from '../button';
import styles from './donation-button.module.scss';

interface DonationButtonProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DonationButton: FC<DonationButtonProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { openDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Button
      className={cx(styles.button, modeClass[colorThemeMode], className)}
      onClick={openDonationModal}
      theme="secondary"
    >
      <span>{t('common|Support')}</span>
      <img src={Ukraine} alt="Ukraine" className={styles.ukraineOutline} />
    </Button>
  );
};
