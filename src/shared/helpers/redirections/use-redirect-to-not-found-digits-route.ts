import { useRedirectionCallback } from './use-redirection-callback';
import { buildNotFoundDigitsPagePathname } from '../routing';

export const useRedirectToNotFoundDigitsRoute = () => useRedirectionCallback(buildNotFoundDigitsPagePathname);
