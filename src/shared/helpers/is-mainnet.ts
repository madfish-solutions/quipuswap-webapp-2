import { NetworkType } from '@airgap/beacon-sdk';

import { NETWORK_ID } from '@config/environment';

export const isMainnet = () => NETWORK_ID === NetworkType.MAINNET;
