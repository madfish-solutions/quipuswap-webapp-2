import { BAKERS_HTTP, CLOUDFLARE_IPFS, IPFS, IPFS_GATEWAY, TEMPLEWALLET_IMG } from '@app.config';

export const prepareTokenLogo = (url?: string | null) => {
  if (!url?.trim()) {
    return null;
  }

  const trimUrl = url.trim();

  const splitLink = trimUrl.split('://');
  const getProtocol: string = splitLink && splitLink.length ? splitLink[0] : '';
  const isIpfs = getProtocol === IPFS;

  if (isIpfs) {
    return `${TEMPLEWALLET_IMG}/${IPFS_GATEWAY}/${splitLink[1]}`;
  }

  if (
    trimUrl.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null ||
    trimUrl.includes(CLOUDFLARE_IPFS) ||
    trimUrl.includes(IPFS_GATEWAY) ||
    trimUrl.includes(BAKERS_HTTP)
  ) {
    return `${TEMPLEWALLET_IMG}/${trimUrl}`;
  }

  return null;
};
