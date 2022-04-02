import { object } from 'yup';

import { useTranslation } from '@shared/hooks';
import { ActiveStatus, Undefined } from '@shared/types';

export const useFarmingStatusValidation = (farmStatus: Undefined<ActiveStatus>) => {
  const { t } = useTranslation(['farm']);

  return object()
    .shape({})
    .test(
      'value-type1',
      () => t('farm|pending'),
      _ => farmStatus !== ActiveStatus.PENDING
    )
    .test(
      'value-type2',
      () => t('farm|disabled'),
      _ => farmStatus !== ActiveStatus.DISABLED
    );
};
