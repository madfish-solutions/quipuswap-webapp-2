import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { DONATION_ADDRESS } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { Modal } from '@components/modals/Modal';
import { Button } from '@components/ui/elements/button';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';
import { useToasts } from '@hooks/use-toasts';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined, isNull } from '@utils/helpers';

import styles from './donation-modal.module.sass';

export const DonationModal: FC = () => {
  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const { t } = useTranslation(['common']);
  const { donationModalOpen, closeDonationModal } = useGlobalModalsState();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();

  const onDonateClick = async () => {
    try {
      const operation = await defined(tezos).wallet.transfer({ to: DONATION_ADDRESS, amount: 1 }).send();

      closeDonationModal();

      await confirmOperation(operation.opHash, {
        message: t('common|donationSuccess')
      });
    } catch (e) {
      showErrorToast(e as Error);
    }
  };

  return (
    <Modal
      portalClassName={styles.modal}
      title={t('common|Donate')}
      isOpen={donationModalOpen}
      onRequestClose={closeDonationModal}
    >
      TODO: add modal content
      {isNull(accountPkh) ? <ConnectWalletButton /> : <Button onClick={onDonateClick}>Donate</Button>}
    </Modal>
  );
};
