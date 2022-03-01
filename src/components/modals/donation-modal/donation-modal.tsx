import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TEZOS_TOKEN } from '@app.config';
import { Modal } from '@components/modals/Modal';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';

import s from './donation-modal.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DonationModal: FC = () => {
  const { t } = useTranslation(['common']);
  const { donationModalOpen, closeDonationModal } = useGlobalModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.modal, modeClass[colorThemeMode]);

  return (
    <Modal
      contentClassName={compoundClassName}
      title={t('common|Donate')}
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
        <Button className={s.button}>Donate</Button>
      </div>
    </Modal>
  );
};
