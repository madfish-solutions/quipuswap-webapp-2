import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { Optional, SwapTabAction, Undefined } from '@shared/types';

import { getTokenSlug } from '../tokens';

const TEZOS_TOKEN_SLUG = getTokenSlug(TEZOS_TOKEN);
const DEFAULT_TOKEN_SLUG = getTokenSlug(DEFAULT_TOKEN);

export const makeSwapOrSendRedirectionUrl = (
  query: { from: Undefined<string>; to: Undefined<string> },
  action: Optional<SwapTabAction>
) => {
  const { from: rawLegacyFrom, to: rawLegacyTo } = query;
  const legacyFrom = rawLegacyFrom ? rawLegacyFrom.toString() : null;
  const legacyTo = rawLegacyTo ? rawLegacyTo.toString() : null;

  const defaultFrom = legacyTo === TEZOS_TOKEN_SLUG ? DEFAULT_TOKEN_SLUG : TEZOS_TOKEN_SLUG;
  const defaultTo = legacyFrom === DEFAULT_TOKEN_SLUG ? TEZOS_TOKEN_SLUG : DEFAULT_TOKEN_SLUG;

  const from = legacyFrom ?? defaultFrom;
  const to = legacyTo ?? defaultTo;
  const tab = action ?? SwapTabAction.SWAP;

  return `/${tab}/${from}-${to}`;
};
