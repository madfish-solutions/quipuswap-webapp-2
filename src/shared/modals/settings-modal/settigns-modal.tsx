import { observer } from 'mobx-react-lite';

import { Button, Slippage, TransactionDeadline } from '@shared/components';

import { Modal } from '../modal';
import styles from './settings-modal.module.scss';
import { useSettingModalViewModel } from './settings-modal.vm';

export const SettingsModal = observer(() => {
  const {
    liquiditySlippageValue,
    handleLiquiditySlippageChange,
    liquiditySlippageError,

    tradingSlippageValue,
    handleTradingSlippageChange,
    tradingSlippageError,

    transactionDeadlineValue,
    handleTransactionDeadlineChange,
    transactionDeadlineError,

    isInvalid,
    setSettings,
    resetSettings,

    settingsModalOpen,
    closeSettingsModal,

    translation
  } = useSettingModalViewModel();

  const {
    modalTitleTranslation,
    liquiditySlippageTitleTranslation,
    liquiditySlippageTooltipTranslation,
    tradingSlippageTitleTranslation,
    tradingSlippageTooltipTranslation,
    resetTranslation,
    saveTranslation
  } = translation;

  return (
    <Modal
      title={modalTitleTranslation}
      contentClassName={styles.modal}
      isOpen={settingsModalOpen}
      onRequestClose={closeSettingsModal}
    >
      <Slippage
        title={liquiditySlippageTitleTranslation}
        tooltip={liquiditySlippageTooltipTranslation}
        error={liquiditySlippageError}
        slippage={liquiditySlippageValue}
        onChange={handleLiquiditySlippageChange}
      />

      <Slippage
        title={tradingSlippageTitleTranslation}
        tooltip={tradingSlippageTooltipTranslation}
        error={tradingSlippageError}
        slippage={tradingSlippageValue}
        onChange={handleTradingSlippageChange}
      />

      <TransactionDeadline
        error={transactionDeadlineError}
        onChange={handleTransactionDeadlineChange}
        value={transactionDeadlineValue}
      />

      <div className={styles.buttons}>
        <Button theme="secondary" onClick={resetSettings}>
          {resetTranslation}
        </Button>
        <Button disabled={isInvalid} onClick={setSettings}>
          {saveTranslation}
        </Button>
      </div>
    </Modal>
  );
});
