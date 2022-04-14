import { FC, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { amplitudeService } from '../../services';

export const AmplitudeSubscription: FC = () => {
  const location = useLocation();

  useEffect(() => {
    amplitudeService.logEvent('URL_CHANGE', { location });
  }, [location]);

  return null;
};
