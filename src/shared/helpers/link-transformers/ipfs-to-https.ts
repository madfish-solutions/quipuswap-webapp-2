import { IPFS_GATEWAY } from '@config/config';

export const ipfsToHttps = (str: string) => str.replace('ipfs://', `${IPFS_GATEWAY}/`);
