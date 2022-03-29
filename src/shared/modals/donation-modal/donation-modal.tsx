import { FC, useCallback, useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext } from '@providers';
import cx from 'classnames';

import { TEZOS_TOKEN, TEZOS_TOKEN_SLUG, TEZ_TRANSFER_AMOUNT_CAP } from '@config';
import { ConnectWalletButton } from '@shared/components/connect-wallet-button';
import { Modal } from '@shared/modals/modal';
import { TokenSelect } from '@shared/components/token-select/token-select';
import { Button } from '@shared/components/button';
import { useGlobalModalsState } from '@shared/hooks/use-global-modals-state';
import { useBalances } from '@providers';
import { useAccountPkh, useTezos } from '@providers';
import { useOnBlock } from '@shared/dapp/use-on-block';
import { isEmptyArray, isExist, isNull } from '@shared/helpers/type-checks';

import s from './donation-modal.module.sass';
import { useDonationFormik } from './use-donation-formik';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DonationModal: FC = () => {
  // const { t } = useTranslation(['common']);
  const { donationModalOpen, closeDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(s.modal, modeClass[colorThemeMode]);

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
      portalClassName={s.modal}
      title={t('common|Donate')}
      contentClassName={compoundClassName}
      isOpen={donationModalOpen}
      onRequestClose={handleRequestClose}
    >
      <div className={s.column}>
        <img src="/ukraine_outline.png" alt="Ukraine" className={s.image} />
        <div className={s.title}>Stand with Ukraine</div>
        <div className={s.description}>Donate TEZ - support Ukrainians in their fight with Putin occupants</div>
        <Button external href="https://donate.tezos.org.ua/" theme="underlined" className={s.learnMore}>
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
          className={s.input}
          value={values.amount}
          placeholder="0.00"
        />
        {isNull(accountPkh) ? (
          <ConnectWalletButton className={s.button} />
        ) : (
          <Button onClick={submitForm} className={s.button} disabled={submitDisabled}>
            Donate
          </Button>
        )}
      </div>
    </Modal>
  );
};
