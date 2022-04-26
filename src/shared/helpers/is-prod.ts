import { QUIPUSWAP_DOMAIN_NAME } from '@config/config';

export const isProd = () => window.location.host.includes(QUIPUSWAP_DOMAIN_NAME);
