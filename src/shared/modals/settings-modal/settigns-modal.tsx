import { observer } from 'mobx-react-lite';

import { Button, Slippage, SlippageType, TransactionDeadline } from '@shared/components';

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
        type={SlippageType.LIQUIDITY}
        title={liquiditySlippageTitleTranslation}
        tooltip={liquiditySlippageTooltipTranslation}
        error={liquiditySlippageError}
        slippage={liquiditySlippageValue}
        data-test-id="slippageLiquidity"
        onChange={handleLiquiditySlippageChange}
      />

      <Slippage
        type={SlippageType.TRADING}
        title={tradingSlippageTitleTranslation}
        tooltip={tradingSlippageTooltipTranslation}
        error={tradingSlippageError}
        slippage={tradingSlippageValue}
        data-test-id="slippageTrading"
        onChange={handleTradingSlippageChange}
      />

      <TransactionDeadline
        error={transactionDeadlineError}
        onChange={handleTransactionDeadlineChange}
        value={transactionDeadlineValue}
        data-test-id="transactionDeadline"
      />

      <div className={styles.buttons}>
        <Button theme="secondary" onClick={resetSettings} data-test-id="resetButton">
          {resetTranslation}
        </Button>
        <Button disabled={isInvalid} onClick={setSettings} data-test-id="saveButton">
          {saveTranslation}
        </Button>
      </div>
    </Modal>
  );
});
