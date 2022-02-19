import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';
import s from '@styles/CommonContainer.module.sass';

export const UnstakeForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const stakingFormStore = useStakingFormStore();

  const availableBalance = stakingFormStore.stakeItem?.depositBalance;

  return (
    <div className={s.content}>
      UnstakeForm {t('Hello')} {availableBalance}
    </div>
  );
});
