import React from 'react';

import { useTranslation } from 'next-i18next';

import { Button } from '@components/ui/elements/button';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';

import styles from './donation-button.module.sass';

interface DonationButtonProps {
  className?: string;
}

export const DonationButton: React.FC<DonationButtonProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { openDonationModal } = useGlobalModalsState();

  return (
    <Button className={className} onClick={openDonationModal} theme="secondary">
      {t('common|Support')}
      <img src="/ukraine_outline.png" alt="Ukraine" className={styles.ukraineOutline} />
    </Button>
  );
};
