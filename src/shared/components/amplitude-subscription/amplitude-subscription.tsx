import { FC, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useAccountPkh } from '@providers/use-dapp';

import { hash } from '../../helpers';
import { amplitudeService } from '../../services';

export const AmplitudeSubscription: FC = () => {
  const location = useLocation();
  const accountPkh = useAccountPkh();

  useEffect(() => {
    amplitudeService.logEvent('URL_CHANGE', { location });
  }, [location]);

  useEffect(() => {
    amplitudeService.setUserId(accountPkh ? hash(accountPkh) : null);
  }, [accountPkh]);

  return null;
};
