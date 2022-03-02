import { FC, useCallback, useContext, useEffect } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TEZOS_TOKEN, TEZOS_TOKEN_SLUG, TEZ_TRANSFER_AMOUNT_CAP } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { Modal } from '@components/modals/Modal';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';
import { useBalances } from '@providers/BalancesProvider';
import { useAccountPkh, useOnBlock, useTezos } from '@utils/dapp';
import { isEmptyArray, isExist, isNull } from '@utils/helpers';

import s from './donation-modal.module.sass';
import { useDonationFormik } from './use-donation-formik';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DonationModal: FC = () => {
  const { t } = useTranslation(['common']);
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
        <img src="ukraine_outline.png" alt="Ukraine" className={s.image} />
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
