import { IPFS_GATEWAY } from '@app.config';

export const ipfsToHttps = (str: string) => str.replace('ipfs://', `${IPFS_GATEWAY}/`);
