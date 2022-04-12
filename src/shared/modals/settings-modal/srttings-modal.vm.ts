import { useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { useSettingsStore } from '@shared/hooks/use-settings-store';

const useLiquiditySlippageFormik = (liquiditySlippage: BigNumber) => {
  const [liquiditySlippageValue, setLiquiditySlippageValue] = useState(liquiditySlippage);

  const handleLiquiditySlippageChange = (newValue: BigNumber) => {
    setLiquiditySlippageValue(newValue);
  };

  const liquiditySlippageError = 'Error';

  return {
    liquiditySlippageValue,
    handleLiquiditySlippageChange,
    liquiditySlippageError
  };
};

const useTradingSlippageFormik = (tradingSlippage: BigNumber) => {
  const [tradingSlippageValue, setTradingSlippageValue] = useState(tradingSlippage);

  const handleTradingSlippageChange = (newValue: BigNumber) => {
    setTradingSlippageValue(newValue);
  };

  const tradingSlippageError = 'Error';

  return {
    tradingSlippageValue,
    handleTradingSlippageChange,
    tradingSlippageError
  };
};

const useTransactionDeadlineFormik = (transactionDeadLine: BigNumber) => {
  const [transactionDeadlineValue, setTransactionDeadlineValue] = useState(transactionDeadLine);

  const handleTransactionDeadlineChange = (newValue: BigNumber) => {
    setTransactionDeadlineValue(newValue);
  };

  const transactionDeadlineError = 'Error';

  return {
    transactionDeadlineValue,
    handleTransactionDeadlineChange,
    transactionDeadlineError
  };
};

export const useSettingModalViewModel = () => {
  const settingsStore = useSettingsStore();
  const { settings } = settingsStore;
  const { settingsModalOpen, closeSettingsModal } = useGlobalModalsState();

  const { liquiditySlippageValue, handleLiquiditySlippageChange, liquiditySlippageError } = useLiquiditySlippageFormik(
    settings.liquiditySlippage
  );

  const { tradingSlippageValue, handleTradingSlippageChange, tradingSlippageError } = useTradingSlippageFormik(
    settings.tradingSlippage
  );

  const { transactionDeadlineValue, handleTransactionDeadlineChange, transactionDeadlineError } =
    useTransactionDeadlineFormik(settings.transactionDeadline);

  const setSettings = () => {
    settingsStore.updateSettings({
      liquiditySlippage: liquiditySlippageValue.toFixed(),
      tradingSlippage: tradingSlippageValue.toFixed(),
      transactionDeadline: transactionDeadlineValue.toFixed()
    });

    closeSettingsModal();
  };
  const resetSettings = () => {
    settingsStore.resetSettings();

    closeSettingsModal();
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
