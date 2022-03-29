import { IPFS_GATEWAY } from '@config';

export const ipfsToHttps = (str: string) => str.replace('ipfs://', `${IPFS_GATEWAY}/`);
