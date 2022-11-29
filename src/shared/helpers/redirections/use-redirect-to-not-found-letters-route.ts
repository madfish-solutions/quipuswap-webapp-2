import { buildNotFoundLettersPagePathname } from '../routing';
import { useRedirectionCallback } from './use-redirection-callback';

export const useRedirectToNotFoundLettersRoute = () => useRedirectionCallback(buildNotFoundLettersPagePathname);
