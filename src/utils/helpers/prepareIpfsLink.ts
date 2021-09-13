import {
  IPFS,
  IPFS_IO,
} from '@utils/defaults';

export const prepareIpfsLink = (url?: string | null) => {
  if (!url?.trim()) {
    return null;
  }

  const trimUrl = url.trim();

  const splitLink = trimUrl.split('://');
  const getProtocol: string = splitLink && splitLink.length ? splitLink[0] : '';
  const isIpfs = getProtocol === IPFS;

  if (isIpfs) {
    return `${IPFS_IO}${splitLink[1]}`;
  }

  if (trimUrl.match(/\.(md)$/) !== null) {
    return `${trimUrl}`;
  }

  return null;
};
