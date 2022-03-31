import { useTranslation } from 'next-i18next';
import { object } from 'yup';

import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { Undefined } from '@utils/types';

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
