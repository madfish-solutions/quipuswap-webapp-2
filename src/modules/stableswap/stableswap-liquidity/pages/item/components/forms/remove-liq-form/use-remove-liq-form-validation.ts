import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LP_INPUT_KEY } from '@config/constants';
import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../../../../../../helpers';

export const useRemoveLiqFormValidation = (
  userLpBalance: Nullable<BigNumber>,
  userTokenBalance: Array<BigNumber>,
  isBalancedProportion: boolean
) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const isZeroInclusive = !isBalancedProportion;
    const inputAmountSchemas: Array<NumberAsStringSchema> = userTokenBalance.map(balance =>
      operationAmountSchema(balance, isZeroInclusive)
    );
    const lpInputShema = operationAmountSchema(userLpBalance);

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((item, index) => {
      const schema = isBalancedProportion ? item.required(t('common|Value is required')) : item;

      return [getInputSlugByIndex(index), schema];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape({
      [LP_INPUT_KEY]: lpInputShema.required(
        isBalancedProportion ? t('common|Value is required') : t('common|At least one output amount should be provided')
      ),
      ...shape
    });
  }, [isBalancedProportion, t, userLpBalance, userTokenBalance]);
};
