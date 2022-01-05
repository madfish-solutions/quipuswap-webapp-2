import { FC } from 'react';

import { appi18n } from '@app.i18n';
import { BaseLayout } from '@components/common/BaseLayout';
import { Voting } from '@containers/Voting';
import s from '@styles/Voting.module.sass';

export const VotePage: FC = () => {
  const { t } = appi18n;

  return (
    <BaseLayout
      title={t('vote|Vote page')}
      description={t('vote|Vote page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Voting />
    </BaseLayout>
  );
};
