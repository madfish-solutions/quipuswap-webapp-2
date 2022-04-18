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
      testId="settingsModal"
    >
      <Slippage
        type={SlippageType.LIQUIDITY}
        title={liquiditySlippageTitleTranslation}
        tooltip={liquiditySlippageTooltipTranslation}
        error={liquiditySlippageError}
        slippage={liquiditySlippageValue}
        testId="slippageLiquidity"
        onChange={handleLiquiditySlippageChange}
      />

      <Slippage
        type={SlippageType.TRADING}
        title={tradingSlippageTitleTranslation}
        tooltip={tradingSlippageTooltipTranslation}
        error={tradingSlippageError}
        slippage={tradingSlippageValue}
        testId="slippageTrading"
        onChange={handleTradingSlippageChange}
      />

      <TransactionDeadline
        error={transactionDeadlineError}
        onChange={handleTransactionDeadlineChange}
        value={transactionDeadlineValue}
        testId="transactionDeadline"
      />

      <div className={styles.buttons}>
        <Button theme="secondary" onClick={resetSettings} testId="resetButton">
          {resetTranslation}
        </Button>
        <Button disabled={isInvalid} onClick={setSettings} testId="saveButton">
          {saveTranslation}
        </Button>
      </div>
    </Modal>
  );
});
