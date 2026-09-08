import { NetworkType } from '@ecadlabs/beacon-types';

import { NETWORK_ID } from '@config/environment';

export const isMainnet = () => NETWORK_ID === NetworkType.MAINNET;
