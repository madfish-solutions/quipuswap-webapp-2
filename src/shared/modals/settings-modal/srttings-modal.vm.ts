import { BigNumber } from 'bignumber.js';

import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { useSettingsStore } from '@shared/hooks/use-settings-store';

const useLiquiditySlippageFormik = () => {
  const liquiditySlippageError = 'Error';
  let liquiditySlippageValue = new BigNumber('0');
  const handleLiquiditySlippageChange = (newValue: BigNumber) => {
    liquiditySlippageValue = newValue;
  };

  return {
    liquiditySlippageValue,
    handleLiquiditySlippageChange,
    liquiditySlippageError
  };
};

const useTradingSlippageFormik = () => {
  const tradingSlippageError = 'Error';
  let tradingSlippageValue = new BigNumber('0');
  const handleTradingSlippageChange = (newValue: BigNumber) => {
    tradingSlippageValue = newValue;
  };

  return {
    tradingSlippageValue,
    handleTradingSlippageChange,
    tradingSlippageError
  };
};

const useTransactionDeadlineFormik = () => {
  const transactionDeadlineError = 'Error';
  let transactionDeadlineValue = new BigNumber('0');
  const handleTransactionDeadlineChange = (newValue: BigNumber) => {
    transactionDeadlineValue = newValue;
  };

  return {
    transactionDeadlineValue,
    handleTransactionDeadlineChange,
    transactionDeadlineError
  };
};

export const useSettingModalViewModel = () => {
  const { updateSettings, resetSettings } = useSettingsStore();
  const { settingsModalOpen, closeSettingsModal } = useGlobalModalsState();

  const { liquiditySlippageValue, handleLiquiditySlippageChange, liquiditySlippageError } =
    useLiquiditySlippageFormik();

  const { tradingSlippageValue, handleTradingSlippageChange, tradingSlippageError } = useTradingSlippageFormik();

  const { transactionDeadlineValue, handleTransactionDeadlineChange, transactionDeadlineError } =
    useTransactionDeadlineFormik();

  const setSettings = () => {
    updateSettings({
      liquiditySlippage: liquiditySlippageValue.toFixed(),
      tradingSlippage: tradingSlippageValue.toFixed(),
      transactionDeadline: transactionDeadlineValue.toFixed()
    });
  };

  const translation = {
    modalTitleTranslation: 'Settings',

    liquiditySlippageTitleTranslation: 'Liquidity Slippage',
    liquiditySlippageTooltipTranslation: 'toolitp',

    tradingSlippageTitleTranslation: 'Trading Slippage',
    tradingSlippageTooltipTranslation: 'toolitp2',

    resetTranslation: 'Reset',
    saveTranslation: 'Save'
  };

  return {
    liquiditySlippageValue,
    handleLiquiditySlippageChange,
    liquiditySlippageError,

    tradingSlippageValue,
    handleTradingSlippageChange,
    tradingSlippageError,

    transactionDeadlineValue,
    handleTransactionDeadlineChange,
    transactionDeadlineError,

    setSettings,
    resetSettings,

    settingsModalOpen,
    closeSettingsModal,

    translation
  };
};
