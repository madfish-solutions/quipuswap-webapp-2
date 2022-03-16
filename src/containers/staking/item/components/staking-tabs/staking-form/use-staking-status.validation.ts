import { useTranslation } from 'next-i18next';
import { object } from 'yup';

import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { Undefined } from '@utils/types';

export const useStakingStatusValidation = (stakingStatus: Undefined<ActiveStatus>) => {
  const { t } = useTranslation(['stake']);

  return object()
    .shape({})
    .test(
      'value-type1',
      () => t('stake|pending'),
      _ => stakingStatus !== ActiveStatus.PENDING
    )
    .test(
      'value-type2',
      () => t('stake|disabled'),
      _ => stakingStatus !== ActiveStatus.DISABLED
    );
};
