/* eslint-disable no-console */
import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import { noop } from 'rxjs';
import { object as objectSchema } from 'yup';

import {
  MAX_SLIPPAGE_PERCENTAGE,
  MAX_DEADLINE_MINS,
  MIN_DEADLINE_MINS,
  MIN_SLIPPAGE_PERCENTAGE
} from '@config/constants';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { isExist } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { SettingsModel } from '@shared/store/settings.store';
import { Undefined } from '@shared/types';
import { bigNumberSchema } from '@shared/validators';

enum SettingsFormValues {
  LIQUIDITY_SLIPPAGE = 'LIQUIDITY_SLIPPAGE',
  TRADING_SLIPPAGE = 'TRADING_SLIPPAGE',
  TRANSACTION_DEADLINE = 'TRANSACTION_DEADLINE'
}

const useSettingsFormik = (initialSettings: SettingsModel) => {
  const validationSchema = objectSchema().shape({
    [SettingsFormValues.LIQUIDITY_SLIPPAGE]: bigNumberSchema(MIN_SLIPPAGE_PERCENTAGE, MAX_SLIPPAGE_PERCENTAGE),
    [SettingsFormValues.TRADING_SLIPPAGE]: bigNumberSchema(MIN_SLIPPAGE_PERCENTAGE, MAX_SLIPPAGE_PERCENTAGE),
    [SettingsFormValues.TRANSACTION_DEADLINE]: bigNumberSchema(MIN_DEADLINE_MINS, MAX_DEADLINE_MINS)
  });

  const initialValues = {
    [SettingsFormValues.LIQUIDITY_SLIPPAGE]: initialSettings.liquiditySlippage,
    [SettingsFormValues.TRADING_SLIPPAGE]: initialSettings.tradingSlippage,
    [SettingsFormValues.TRANSACTION_DEADLINE]: initialSettings.transactionDeadline
  };

  const { errors, values, setFieldValue } = useFormik({
    validationSchema,
    initialValues,
    onSubmit: noop,
    validateOnChange: true
  });

  const handleLiquiditySlippageChange = (newValue: BigNumber) => {
    setFieldValue(SettingsFormValues.LIQUIDITY_SLIPPAGE, newValue);
  };
  const handleTradingSlippageChange = (newValue: BigNumber) => {
    setFieldValue(SettingsFormValues.TRADING_SLIPPAGE, newValue);
  };
  const handleTransactionDeadlineChange = (newValue: BigNumber) => {
    setFieldValue(SettingsFormValues.TRANSACTION_DEADLINE, newValue);
  };

  return {
    liquiditySlippageValue: values[SettingsFormValues.LIQUIDITY_SLIPPAGE],
    handleLiquiditySlippageChange,
    liquiditySlippageError: errors[SettingsFormValues.LIQUIDITY_SLIPPAGE] as Undefined<string>,

    tradingSlippageValue: values[SettingsFormValues.TRADING_SLIPPAGE],
    handleTradingSlippageChange,
    tradingSlippageError: errors[SettingsFormValues.TRADING_SLIPPAGE] as Undefined<string>,

    transactionDeadlineValue: values[SettingsFormValues.TRANSACTION_DEADLINE],
    handleTransactionDeadlineChange,
    transactionDeadlineError: errors[SettingsFormValues.TRANSACTION_DEADLINE] as Undefined<string>
  };
};

export const useSettingModalViewModel = () => {
  const settingsStore = useSettingsStore();
  const { settings } = settingsStore;
  const { settingsModalOpen, closeSettingsModal } = useGlobalModalsState();

  const {
    liquiditySlippageValue,
    handleLiquiditySlippageChange,
    liquiditySlippageError,

    tradingSlippageValue,
    handleTradingSlippageChange,
    tradingSlippageError,

    transactionDeadlineValue,
    handleTransactionDeadlineChange,
    transactionDeadlineError
  } = useSettingsFormik(settings);

  const isInvalid =
    isExist(liquiditySlippageError) || isExist(tradingSlippageError) || isExist(transactionDeadlineError);

  const setSettings = () => {
    if (isInvalid) {
      return;
    }

    settingsStore.updateSettings({
      liquiditySlippage: liquiditySlippageValue.toNumber(),
      tradingSlippage: tradingSlippageValue.toNumber(),
      transactionDeadline: transactionDeadlineValue.toNumber()
    });

    closeSettingsModal();
  };
  const resetSettings = () => {
    settingsStore.resetSettings();
    handleLiquiditySlippageChange(settingsStore.settings.liquiditySlippage);
    handleTradingSlippageChange(settingsStore.settings.tradingSlippage);
    handleTransactionDeadlineChange(settingsStore.settings.transactionDeadline);

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

    isInvalid,
    setSettings,
    resetSettings,

    settingsModalOpen,
    closeSettingsModal,

    translation
  };
};
