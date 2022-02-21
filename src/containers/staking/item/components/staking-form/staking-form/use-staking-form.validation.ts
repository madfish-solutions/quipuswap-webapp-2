import { useMemo } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export const useStakingFormValidation = (userBalance: Nullable<BigNumber>) =>
  useMemo(() => {
    const balanceSchema = userBalance
      ? yup.number().max(userBalance?.toNumber() || 0, `Max available balance is ${userBalance?.toNumber()}`)
      : yup.number();

    return yup.object().shape({
      balance: balanceSchema.required('Balance is required'),
      selectedBaker: yup.string().required('Baker is required')
    });
  }, [userBalance]);
