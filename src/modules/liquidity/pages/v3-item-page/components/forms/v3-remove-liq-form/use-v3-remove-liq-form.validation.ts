import * as yup from 'yup';

import { PERCENT_100 } from '@config/constants';
import { isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

import { V3RemoveTokenInput } from '../interface';

export const useV3RemoveLiqFormValidation = () => {
  const { t } = useTranslation();

  const schema = yup.string().test(
    'should be less then 100',
    () => t('liquidity|valueShouldBeLessThen100'),
    value => (isExist(value) ? Number(value) <= PERCENT_100 : true)
  );

  return yup.object().shape({
    [V3RemoveTokenInput.firstTokenInput]: schema.required('Amount is required!')
  });
};
