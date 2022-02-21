import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export const useStakingFormValidation = (userBalance: Nullable<BigNumber>) =>
  yup.object().shape({
    balance: yup
      .number()
      .when('self_user', {
        is: !!userBalance,
        then: yup.number().max(userBalance?.toNumber() || 0, `Max available balance is ${userBalance?.toNumber()}`)
      })
      .required('Balance is required'),
    selectedBaker: yup.string().required('Baker is required')
  });
