import { useCallback } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

export const useRedirectionCallback = (redirectionUrlFn: (location: Location) => string) => {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(() => navigate(redirectionUrlFn(location)), [location, navigate, redirectionUrlFn]);
};
