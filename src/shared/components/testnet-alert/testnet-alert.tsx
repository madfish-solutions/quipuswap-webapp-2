import { FC } from 'react';

import { IS_NETWORK_MAINNET } from '@config/config';
import { useTranslation } from '@translation';

import s from './testnet-alert.module.scss';
import { AlarmMessage } from '../alarm-message';

export const TestnetAlert: FC = () => {
  const { t } = useTranslation(['common']);

  return IS_NETWORK_MAINNET ? null : (
    <div className={s.testNet}>
      <AlarmMessage message={t('common|You are on Testnet now!')} className={s.AlarmMessage} />
    </div>
  );
};
