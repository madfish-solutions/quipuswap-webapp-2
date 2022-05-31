import { EMPTY_STRING } from '@config/constants';

const STABLESWAP_INPUT = 'stableswap-input';

export const getInputSlugByIndex = (index: number) => `${STABLESWAP_INPUT}-${index}`;
export const getIndexByInputSlug = (slug: string) => Number(slug.replace(`${STABLESWAP_INPUT}-`, EMPTY_STRING));
