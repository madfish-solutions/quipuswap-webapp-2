import React, { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { AlarmMessage } from '@components/common/alarm-message';
import { useNetwork } from '@utils/dapp';
import { QSNetworkType } from '@utils/types';

import s from './testnet-alert.module.sass';

export const TestnetAlert: FC = () => {
  const { t } = useTranslation(['common']);
  const network = useNetwork();
  const isTestNet = network && network.type === QSNetworkType.TEST;

  return isTestNet ? (
    <div className={s.testNet}>
      <AlarmMessage message={t('common|You are on Test net now!')} className={s.AlarmMessage} />
    </div>
  ) : null;
};
