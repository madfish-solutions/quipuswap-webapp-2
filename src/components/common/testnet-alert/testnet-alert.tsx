import React, { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { NETWORK } from '@app.config';
import { AlarmMessage } from '@components/common/alarm-message';
import { isNetworkMainnet } from '@utils/helpers';

import s from './testnet-alert.module.sass';

export const TestnetAlert: FC = () => {
  const { t } = useTranslation(['common']);

  return !isNetworkMainnet(NETWORK) ? (
    <div className={s.testNet}>
      <AlarmMessage message={t('common|You are on Testnet now!')} className={s.AlarmMessage} />
    </div>
  ) : null;
};
