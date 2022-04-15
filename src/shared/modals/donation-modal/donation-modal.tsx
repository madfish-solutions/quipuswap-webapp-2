import { FC, useCallback, useContext, useEffect } from 'react';

import cx from 'classnames';
import { isEmptyArray } from 'formik';

import { TEZ_TRANSFER_AMOUNT_CAP } from '@config/constants';
import { TEZOS_TOKEN, TEZOS_TOKEN_SLUG } from '@config/tokens';
import Ukraine from '@images/ukraine_outline.png';
import { useBalances } from '@providers/balances-provider';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { Button, TokenSelect, ConnectWalletButton } from '@shared/components';
import { isExist, isNull } from '@shared/helpers';
import { useOnBlock } from '@shared/hooks';
import { useTranslation } from '@translation';

import { Modal } from '../modal';
import styles from './donation-modal.module.scss';
import { useDonationFormik } from './use-donation-formik';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DonationModal: FC = () => {
  const { t } = useTranslation(['common']);
  const { donationModalOpen, closeDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.modal, modeClass[colorThemeMode]);

  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const { balances, updateBalance } = useBalances();
  const { errors, submitForm, handleChange, values, resetForm } = useDonationFormik();
  const submitDisabled = !isEmptyArray(Object.keys(errors));

  const updateTezosBalance = useCallback(() => {
    if (isExist(accountPkh) && donationModalOpen) {
      updateBalance(TEZOS_TOKEN);
    }
  }, [donationModalOpen, accountPkh, updateBalance]);

  useEffect(() => updateTezosBalance(), [updateTezosBalance]);
  useOnBlock(tezos, updateTezosBalance);
  const tezosBalance = balances[TEZOS_TOKEN_SLUG];

  const handleRequestClose = () => {
    closeDonationModal();
    resetForm();
  };

  return (
    <Modal
      className={styles.modal}
      portalClassName={styles.modalPortal}
      title={t('common|Donate')}
      contentClassName={compoundClassName}
      isOpen={donationModalOpen}
      onRequestClose={handleRequestClose}
      testIds={{
        titleTestId: 'donationTitle',
        buttonCloseId: 'donationButtonClose'
      }}
    >
      <div className={styles.column}>
        <img src={Ukraine} alt="Ukraine" className={styles.image} />
        <div className={styles.title}>Stand with Ukraine</div>
        <div className={styles.description}>Donate TEZ - support Ukrainians in their fight with Putin occupants</div>
        <Button
          external
          href="https://donate.tezos.org.ua/"
          theme="underlined"
          testId="mLearnMore"
          className={styles.learnMore}
        >
          {t('common|Learn more')}
        </Button>
        <TokenSelect
          balance={isExist(tezosBalance) ? tezosBalance.toFixed() : null}
          disabled={false}
          error={errors.amount}
          label=""
          name="amount"
          token={TEZOS_TOKEN}
          blackListedTokens={[]}
          shouldShowBalanceButtons={false}
          shouldHideTokenSelect
          tokenInputAmountCap={TEZ_TRANSFER_AMOUNT_CAP}
          onChange={handleChange}
          className={styles.input}
          value={values.amount}
          placeholder="0.00"
          testId="mBalance"
        />
        {isNull(accountPkh) ? (
          <ConnectWalletButton className={styles.button} testId="mСonnectWalletModalButton" />
        ) : (
          <Button onClick={submitForm} className={styles.button} disabled={submitDisabled} testId="mButtonDonate">
            Donate
          </Button>
        )}
      </div>
    </Modal>
  );
};
