import { useMemo } from 'react';

import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { CreatePositionFormik } from '@modules/liquidity/types';
import { getFormikError, getTokenSymbol, isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

import { shouldAddTokenX, shouldAddTokenY, tezosTokenIsIncluded } from '../../helpers';
import { CreatePositionInput } from '../../types';
import { useCurrentTick } from './use-current-tick';
import { usePositionTicks } from './use-position-ticks';

export const useBottomMessages = (formik: CreatePositionFormik) => {
  const { t } = useTranslation();
  const currentTick = useCurrentTick();
  const { upperTick, lowerTick } = usePositionTicks(formik);
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const bottomError =
    getFormikError(formik, CreatePositionInput.MIN_PRICE) ?? getFormikError(formik, CreatePositionInput.MAX_PRICE);
  const warningMessages = useMemo(() => {
    if (isExist(bottomError)) {
      return [];
    }

    const result: string[] = [];
    const _shouldAddTokenX = currentTick && upperTick && shouldAddTokenX(currentTick.index, upperTick.index);
    const _shouldAddTokenY = currentTick && lowerTick && shouldAddTokenY(currentTick.index, lowerTick.index);

    if (tezosTokenIsIncluded([tokenX, tokenY])) {
      result.push(t('liquidity|v3PositionWithTezCreationWarning'));
    }
    if (_shouldAddTokenX && _shouldAddTokenY) {
      result.push(t('liquidity|v3TwoTokensRatioNotification'));
    } else if ((_shouldAddTokenX || _shouldAddTokenY) && isExist(tokenX) && isExist(tokenY)) {
      const inputToken = _shouldAddTokenX ? tokenX : tokenY;
      const outputToken = _shouldAddTokenX ? tokenY : tokenX;
      result.push(
        t('liquidity|v3OneTokenNotification', {
          inputToken: getTokenSymbol(inputToken),
          outputToken: getTokenSymbol(outputToken)
        })
      );
    }

    return result;
  }, [bottomError, currentTick, lowerTick, t, tokenX, tokenY, upperTick]);

  return { bottomError, warningMessages };
};
