import { NextPageContext } from 'next';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { getTokenSlug } from '@utils/helpers';
import { Optional, SwapTabAction } from '@utils/types';

const TEZOS_TOKEN_SLUG = getTokenSlug(TEZOS_TOKEN);
const DEFAULT_TOKEN_SLUG = getTokenSlug(networksDefaultTokens[NETWORK_ID]);

export const makeSwapOrSendRedirectionUrl = (query: NextPageContext['query'], action: Optional<SwapTabAction>) => {
  const { from: rawLegacyFrom, to: rawLegacyTo } = query;
  const legacyFrom = rawLegacyFrom ? rawLegacyFrom.toString() : null;
  const legacyTo = rawLegacyTo ? rawLegacyTo.toString() : null;

  const defaultFrom = legacyTo === TEZOS_TOKEN_SLUG ? DEFAULT_TOKEN_SLUG : TEZOS_TOKEN_SLUG;
  const defaultTo = legacyFrom === DEFAULT_TOKEN_SLUG ? TEZOS_TOKEN_SLUG : DEFAULT_TOKEN_SLUG;

  const from = legacyFrom ?? defaultFrom;
  const to = legacyTo ?? defaultTo;

  return `/${action === SwapTabAction.SEND ? 'send' : 'swap'}/${from}-${to}`;
};
