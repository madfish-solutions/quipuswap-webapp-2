import { useTranslation } from 'next-i18next';
import { object } from 'yup';

import { StakingStatus } from '@interfaces/staking.interfaces';
import { Undefined } from '@utils/types';

export const useStakingStatusValidation = (stakingStatus: Undefined<StakingStatus>) => {
  const { t } = useTranslation(['stake']);

  return object()
    .shape({})
    .test(
      'value-type1',
      () => t('stake|pending'),
      _ => stakingStatus !== StakingStatus.PENDING
    )
    .test(
      'value-type2',
      () => t('stake|disabled'),
      _ => stakingStatus !== StakingStatus.DISABLED
    );
};
