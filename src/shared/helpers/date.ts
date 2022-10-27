import { MS_IN_SECOND } from '@config/constants';

export const getNowTimestampInSeconds = () => Math.floor(Date.now() / MS_IN_SECOND);
