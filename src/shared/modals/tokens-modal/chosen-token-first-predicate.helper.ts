import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

const calculateTokenPredicateValue = (token: Token, chosenTokens: Token[]) =>
  Number(chosenTokens.some(chosenToken => getTokenSlug(chosenToken) === getTokenSlug(token)));

export const chosenTokenFirstPredicate = (chosenTokens: Token[]) => (first: Token, second: Token) =>
  calculateTokenPredicateValue(second, chosenTokens) - calculateTokenPredicateValue(first, chosenTokens);
