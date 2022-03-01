import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TEZOS_TOKEN, DONATION_ADDRESS } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { Modal } from '@components/modals/Modal';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';
import { useToasts } from '@hooks/use-toasts';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined, isNull } from '@utils/helpers';

import s from './donation-modal.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DonationModal: FC = () => {
  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const { t } = useTranslation(['common']);
  const { donationModalOpen, closeDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.modal, modeClass[colorThemeMode]);

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
      portalClassName={s.modal}
      title={t('common|Donate')}
      contentClassName={compoundClassName}
      isOpen={donationModalOpen}
      onRequestClose={closeDonationModal}
    >
      <div className={s.column}>
        <img src="ukraine_outline.png" alt="Ukraine" className={s.image} />
        <div className={s.title}>Stand with Ukraine</div>
        <div className={s.description}>Donate TEZ - support Ukrainians in their fight with Putin occupants</div>
        <a href="" className={cx(s.learnMore, modeClass[colorThemeMode])}>
          learn more
        </a>
        <TokenSelect
          balance="1"
          label={''}
          handleBalance={function (value: string): void {
            throw new Error('Function not implemented.');
          }}
          token={TEZOS_TOKEN}
          blackListedTokens={[]}
          shouldShowBalanceButtons={false}
          shouldHideTokenSelect={true}
          className={s.input}
        />
        {isNull(accountPkh) ? (
          <ConnectWalletButton />
        ) : (
          <Button onClick={onDonateClick} className={s.button}>
            Donate
          </Button>
        )}
      </div>
    </Modal>
  );
};
