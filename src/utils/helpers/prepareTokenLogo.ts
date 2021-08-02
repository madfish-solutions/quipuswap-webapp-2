import {
  CLOUDFLARE_IPFS,
  IPFS,
  IPFS_IO,
  TEMPLEWALLET_IMG,
} from '@utils/defaults';

export const prepareTokenLogo = (url?: string | null) => {
  if (!url?.trim()) {
    return null;
  }

  const trimUrl = url.trim();

  const splitLink = trimUrl.split('://');
  const getProtocol: string = splitLink && splitLink.length ? splitLink[0] : '';
  const isIpfs = getProtocol === IPFS;

  if (isIpfs) {
    return `${TEMPLEWALLET_IMG}/${IPFS_IO}${splitLink[1]}`;
  }

  if (trimUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null
  || trimUrl.includes(CLOUDFLARE_IPFS)
  || trimUrl.includes(IPFS_IO)) {
    return `${TEMPLEWALLET_IMG}/${trimUrl}`;
  }

  return null;
};
