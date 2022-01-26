import React, { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { IS_NETWORK_MAINNET } from '@app.config';
import { AlarmMessage } from '@components/common/alarm-message';

import s from './testnet-alert.module.sass';

export const TestnetAlert: FC = () => {
  const { t } = useTranslation(['common']);

  return IS_NETWORK_MAINNET ? null : (
    <div className={s.testNet}>
      <AlarmMessage message={t('common|You are on Testnet now!')} className={s.AlarmMessage} />
    </div>
  );
};
