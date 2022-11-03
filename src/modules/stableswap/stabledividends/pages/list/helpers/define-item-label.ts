import { StableswapDividendsItemModel } from '@modules/stableswap/models';
import { LabelComponentProps } from '@shared/components';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

const DEFAULT_LABEL = { status: ActiveStatus.ACTIVE, filled: true };
const WHITELISTED_LABEL = { ...DEFAULT_LABEL, label: i18n.t('common|whiteListed'), DTI: 'whitelisted' };
const ACTIVE_LABEL = { ...DEFAULT_LABEL, DTI: 'active' };

export const defineItemLabel = (item: StableswapDividendsItemModel): LabelComponentProps => {
  if (item.isWhitelisted) {
    return WHITELISTED_LABEL;
  }

  return ACTIVE_LABEL;
};
