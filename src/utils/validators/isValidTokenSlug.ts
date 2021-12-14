import { getContractAddressError, isValidContractAddress } from './isValidContractAddress';

const fa12TokenSlugRegex = /^[a-z0-9]+$/i;
const fa2TokenSlugRegex = /^[a-z0-9]+_[0-9]+$/i;

export const isValidTokenSlug = (slug: string) => {
  if (slug.toLowerCase() === 'tez') {
    return true;
  }
  if (fa12TokenSlugRegex.test(slug) || fa2TokenSlugRegex.test(slug)) {
    const [address] = slug.split('_');
    if (isValidContractAddress(address)) {
      return true;
    }
    return getContractAddressError();
  }

  return 'Token slug should be of format {address} or {address}_{id}';
};
