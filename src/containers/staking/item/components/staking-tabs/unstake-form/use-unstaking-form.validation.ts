import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export const useUnstakingFormValidation = (userBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const balanceSchema = userBalance
      ? yup.number().max(userBalance?.toNumber() || 0, `Max available balance is ${userBalance?.toNumber()}`)
      : yup.number();

    return yup.object().shape({
      inputAmount: balanceSchema.required('Balance is required')
    });
  }, [userBalance]);
