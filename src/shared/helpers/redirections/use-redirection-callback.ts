import { useCallback } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

const DUMMY_BASE_URL = 'https://dummy.com';

export const useRedirectionCallback = (redirectionPathFn: (location: Location) => string) => {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(() => {
    const redirectionUrl = new URL(`${DUMMY_BASE_URL}${redirectionPathFn(location)}`);
    if (
      location.pathname !== redirectionUrl.pathname ||
      location.search !== redirectionUrl.search ||
      location.hash !== redirectionUrl.hash
    ) {
      navigate(redirectionPathFn(location));
    }
  }, [location, navigate, redirectionPathFn]);
};
