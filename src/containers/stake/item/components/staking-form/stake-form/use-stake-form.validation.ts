import BigNumber from 'bignumber.js';
import * as yup from 'yup';

export const useStakeFormValidation = (userBalance: BigNumber) =>
  yup.object().shape({
    balance: yup
      .number()
      .max(userBalance.toNumber(), `Max available balance is ${userBalance.toNumber()}`)
      .required('Balance is required'),
    selectedBaker: yup.string().required('Baker is required')
  });
