import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { Modal } from '@shared/modals';

import { TokenToPlay } from '../../../coinflip';
import { CoinflipGameSelect } from '../../../coinflip/components';
import styles from './harvest-and-roll-modal.module.scss';
import { useHarvestAndRollModal } from './use-harvest-and-roll-modal';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const HarvestAndRollModal: FC<{ opened: boolean }> = ({ opened }) => {
  const { isLoading, coinSide, coinSideError, onCoinSideSelect, onClose, onFlipClick, onHarvestAllClick, texts } =
    useHarvestAndRollModal();

  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.modal, modeClass[colorThemeMode]);

  return (
    <Modal
      className={styles.modal}
      portalClassName={styles.modalPortal}
      title={texts.harvestOrRoll}
      contentClassName={compoundClassName}
      isOpen={opened}
      onRequestClose={onClose}
    >
      <div className={styles.description}>
        Collect rewards or take a chance and double them? Click the flip button to use Coinflip and try to almost double
        your rewards instead of the usual harvesting. Pay attention: losing bets will be lost. Fortune favors the brave!
      </div>

      <CoinflipGameSelect
        isLoading={isLoading}
        tokenToPlay={TokenToPlay.Quipu}
        coinSide={coinSide}
        handleSelectCoinSide={onCoinSideSelect}
        error={coinSideError}
      />

      <div className={styles.buttons}>
        <Button theme="secondary" onClick={onHarvestAllClick}>
          Harvest all
        </Button>
        <Button onClick={onFlipClick}>Flip</Button>
      </div>
    </Modal>
  );
};
