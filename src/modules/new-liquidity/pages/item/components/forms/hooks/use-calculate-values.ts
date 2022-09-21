import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { FISRT_INDEX, OPPOSITE_INDEX } from '@config/constants';
import { LiquidityItem } from '@modules/new-liquidity/interfaces';
import {
  calculateOutputWithToken,
  calculateShares,
  numberAsString,
  saveBigNumber,
  toAtomicIfPossible,
  toFixed,
  toRealIfPossible
} from '@shared/helpers';

import { getTokenAndFieldData } from '../helpers';
import { LP_TOKEN } from '../helpers/mock-lp-token';
import { Input } from '../interface';

export const useCalculateValues = () => {
  const handleInputChange = (index: number, item: LiquidityItem, formik: ReturnType<typeof useFormik>) => {
    const notLocalTokenIndex = Math.abs(index - OPPOSITE_INDEX);

    const {
      decimals: locDecimals,
      atomicTokenTvl: locAtomicTokenTvl,
      inputField: locInputField
    } = getTokenAndFieldData(item.tokensInfo, index);

    const {
      token: notLocToken,
      decimals: notLocDecimals,
      atomicTokenTvl: notLocAtomicTokenTvl,
      inputField: notLocInputField
    } = getTokenAndFieldData(item.tokensInfo, notLocalTokenIndex);

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, locDecimals);
      const atomicInputAmountBN = toAtomicIfPossible(saveBigNumber(fixedValue, null), locDecimals);

      const lpValue = calculateShares(atomicInputAmountBN, locAtomicTokenTvl, item.totalSupply);
      const realLpValue = toRealIfPossible(lpValue, LP_TOKEN.metadata.decimals);

      const notLocalInputValue = calculateOutputWithToken(lpValue, item.totalSupply, notLocAtomicTokenTvl, notLocToken);
      const realNotLocalInputValue = toRealIfPossible(notLocalInputValue, notLocDecimals);

      formik.setValues({
        [locInputField]: realValue,
        [Input.THIRD_INPUT]: toFixed(realLpValue?.decimalPlaces(LP_TOKEN.metadata.decimals)),
        [notLocInputField]: toFixed(realNotLocalInputValue?.decimalPlaces(notLocDecimals, BigNumber.ROUND_DOWN))
      });
    };
  };

  const handleLpInputChange = (item: LiquidityItem, formik: ReturnType<typeof useFormik>) => {
    const {
      token: firstToken,
      decimals: firstTokenDecimals,
      atomicTokenTvl: firstTokenAtomicTokenTvl,
      inputField: firstTokenInputField
    } = getTokenAndFieldData(item.tokensInfo, FISRT_INDEX);

    const {
      token: secondToken,
      decimals: secondTokenDecimals,
      atomicTokenTvl: secondTokenAtomicTokenTvl,
      inputField: secondTokenInputField
    } = getTokenAndFieldData(item.tokensInfo, OPPOSITE_INDEX);

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, LP_TOKEN.metadata.decimals);

      const inputAmountBN = saveBigNumber(fixedValue, null);
      const atomicInputAmout = toAtomicIfPossible(inputAmountBN, LP_TOKEN);

      const firstInputValue = calculateOutputWithToken(
        atomicInputAmout,
        item.totalSupply,
        firstTokenAtomicTokenTvl,
        firstToken
      )?.integerValue(BigNumber.ROUND_DOWN);
      const realFirstInputValue = toRealIfPossible(firstInputValue, firstTokenDecimals)?.decimalPlaces(
        firstTokenDecimals
      );

      const secondInputValue = calculateOutputWithToken(
        atomicInputAmout,
        item.totalSupply,
        secondTokenAtomicTokenTvl,
        secondToken
      )?.integerValue(BigNumber.ROUND_DOWN);
      const realSecondInputValue = toRealIfPossible(secondInputValue, secondTokenDecimals)?.decimalPlaces(
        secondTokenDecimals
      );

      formik.setValues({
        [firstTokenInputField]: toFixed(realFirstInputValue),
        [secondTokenInputField]: toFixed(realSecondInputValue),
        [Input.THIRD_INPUT]: realValue
      });
    };
  };

  return { handleInputChange, handleLpInputChange };
};
