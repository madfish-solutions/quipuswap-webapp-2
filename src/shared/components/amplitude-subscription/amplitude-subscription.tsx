import { FC, useEffect } from 'react';

import { TempleWallet } from '@temple-wallet/dapp';
import { useLocation } from 'react-router-dom';

import { useAccountPkh } from '@providers/use-dapp';

import { hash } from '../../helpers';
import { amplitudeService, sentryService } from '../../services';

export const AmplitudeSubscription: FC = () => {
  const location = useLocation();
  const accountPkh = useAccountPkh();

  useEffect(() => {
    (async () => {
      const isAvailable = await TempleWallet.isAvailable();
      amplitudeService.setUserProps('TempleWallet_installed', isAvailable);
    })();
  }, []);

  useEffect(() => {
    amplitudeService.logEvent('URL_CHANGE', { location });
  }, [location]);

  useEffect(() => {
    amplitudeService.setUserId(accountPkh ? hash(accountPkh) : null);
    sentryService.setUser(accountPkh ? { id: hash(accountPkh) } : null);
  }, [accountPkh]);

  return null;
};
