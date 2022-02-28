import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { Modal } from '@components/modals/Modal';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';

export const DonationModal: FC = () => {
  const { t } = useTranslation(['common']);
  const { donationModalOpen, closeDonationModal } = useGlobalModalsState();

  return (
    <Modal
      contentClassName=""
      title={t('common|Donate')}
      isOpen={donationModalOpen}
      onRequestClose={closeDonationModal}
    >
      TODO: add modal content
    </Modal>
  );
};
