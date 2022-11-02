import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

export const defineWhitelistedOrActiveStatus = (isWhitelisted: boolean) =>
  isWhitelisted
    ? { status: ActiveStatus.ACTIVE, label: i18n.t('common|whiteListed'), filled: true, DTI: 'whitelisted' }
    : { status: ActiveStatus.ACTIVE, filled: true, DTI: 'active' };
