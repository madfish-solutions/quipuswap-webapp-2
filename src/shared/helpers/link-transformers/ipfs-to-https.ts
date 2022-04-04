import { IPFS_GATEWAY } from '@config/enviroment';

export const ipfsToHttps = (str: string) => str.replace('ipfs://', `${IPFS_GATEWAY}/`);
