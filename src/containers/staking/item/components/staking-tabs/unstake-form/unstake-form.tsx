import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import s from '@styles/CommonContainer.module.sass';

export const UnstakeForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const stakingItemStore = useStakingItemStore();
  const { itemStore } = stakingItemStore;
  const { data: stakeItem } = itemStore;

  const availableBalance = stakeItem?.depositBalance;

  return (
    <div className={s.content}>
      UnstakeForm {t('Hello')} {availableBalance}
    </div>
  );
});
