import { useRedirectionCallback } from './use-redirection-callback';
import { buildNotFoundLettersPagePathname } from '../routing';

export const useRedirectToNotFoundLettersRoute = () => useRedirectionCallback(buildNotFoundLettersPagePathname);
