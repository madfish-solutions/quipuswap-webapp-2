import { Dispatch, useCallback, SetStateAction } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { DELAY_BEFORE_DATA_UPDATE, FEE_BASE_POINTS_PRECISION, FIRST_INDEX, SLASH } from '@config/constants';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { useTezos } from '@providers/use-dapp';
import { getFirstElement, isExist, toFraction, sleep, getInvertedValue } from '@shared/helpers';

import { findPool, sortTokens } from '../../helpers';
import { CreatePoolValues, eCreatePoolValues } from '../../types';
import { useDoCreateV3Pool } from '../../use-create-new-pool-page.vm';

export const useHandleSubmit = (
  setAlarmMessageInfo: Dispatch<SetStateAction<{ poolExists: boolean; poolLink: string }>>
) => {
  const tezos = useTezos();
  const { doCreatePool } = useDoCreateV3Pool();
  const navigate = useNavigate();

  return useCallback(
    async (values: CreatePoolValues, actions: FormikHelpers<CreatePoolValues>) => {
      actions.setSubmitting(true);
      const feeRate = new BigNumber(values[eCreatePoolValues.feeRate]);
      const tokens = values[eCreatePoolValues.tokens];
      const sortedTokens = Array.from(values[eCreatePoolValues.tokens]).sort(sortTokens);
      const activeAssetIndex = values[eCreatePoolValues.activeAssetIndex];
      const [token0, token1] = sortedTokens;
      const tokensAreSwapped = token0 !== getFirstElement(tokens);
      const shouldInvertPrice = (activeAssetIndex === FIRST_INDEX) === tokensAreSwapped;
      const rawInitialPrice = values[eCreatePoolValues.initialPrice];
      const initialPrice = shouldInvertPrice
        ? new BigNumber(rawInitialPrice)
        : getInvertedValue(new BigNumber(rawInitialPrice));
      const poolId = await findPool(tezos, toFraction(feeRate).multipliedBy(FEE_BASE_POINTS_PRECISION), sortedTokens);

      if (isExist(poolId)) {
        setAlarmMessageInfo({
          poolExists: true,
          poolLink: `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${SLASH}${poolId}`
        });

        return;
      }

      try {
        await doCreatePool(feeRate, token0, token1, initialPrice);
        await sleep(DELAY_BEFORE_DATA_UPDATE);

        const newPoolId = await findPool(
          tezos,
          toFraction(feeRate).multipliedBy(FEE_BASE_POINTS_PRECISION),
          sortedTokens
        );

        navigate(`${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}${SLASH}${newPoolId}${LiquidityRoutes.create}`);
      } finally {
        actions.resetForm();
        actions.setSubmitting(false);
      }
    },
    [tezos, setAlarmMessageInfo, doCreatePool, navigate]
  );
};
