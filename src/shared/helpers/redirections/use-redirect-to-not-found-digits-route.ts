import { buildNotFoundDigitsPagePathname } from '../routing';
import { useRedirectionCallback } from './use-redirection-callback';

export const useRedirectToNotFoundDigitsRoute = () => useRedirectionCallback(buildNotFoundDigitsPagePathname);
