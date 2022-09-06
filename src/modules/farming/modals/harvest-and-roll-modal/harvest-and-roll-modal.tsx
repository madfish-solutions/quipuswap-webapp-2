import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { QUIPU_TOKEN } from '@config/tokens';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, StateCurrencyAmount } from '@shared/components';
import { Modal } from '@shared/modals';

import { TokenToPlay } from '../../../coinflip';
import { CoinflipGameSelect } from '../../../coinflip/components';
import styles from './harvest-and-roll-modal.module.scss';
import { useHarvestAndRollModalViewModel } from './use-harvest-and-roll-modal.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const HarvestAndRollModal: FC<{ opened: boolean }> = observer(({ opened }) => {
  const {
    betSize,
    betSizeUsd,
    message,
    isLoading,
    isLoadingHarvest,
    coinSide,
    coinSideError,
    onCoinSideSelect,
    onClose,
    onHarvestAndRollClick,
    onHarvestAllClick,
    texts
  } = useHarvestAndRollModalViewModel();

  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.modal, modeClass[colorThemeMode]);

  if (!opened || !betSize) {
    return null;
  }

  return (
    <Modal
      className={styles.modal}
      portalClassName={styles.modalPortal}
      title={texts.harvestOrRoll}
      contentClassName={compoundClassName}
      isOpen={opened}
      onRequestClose={onClose}
    >
      <div className={styles.description}>{texts.harvestOrRollDescription}</div>

      <CoinflipGameSelect
        isLoading={isLoading}
        tokenToPlay={TokenToPlay.Quipu}
        coinSide={coinSide}
        handleSelectCoinSide={onCoinSideSelect}
        error={coinSideError}
      />

      <div className={styles.betSize}>
        <StateCurrencyAmount
          className={styles.amount}
          amount={betSize}
          currency={QUIPU_TOKEN.metadata.symbol}
          dollarEquivalent={betSizeUsd}
          data-test-id="yourClaimableReward"
        />
      </div>
      <p className={styles.message}>{message}</p>

      <div className={styles.buttons}>
        <Button theme="secondary" onClick={onHarvestAllClick} disabled={isLoading} loading={isLoadingHarvest}>
          {texts.justHarvest}
        </Button>
        <Button onClick={onHarvestAndRollClick} disabled={isLoadingHarvest} loading={isLoading}>
          {texts.harvestAndRoll}
        </Button>
      </div>
    </Modal>
  );
});
