import { StableswapDividendsItemModel } from '@modules/stableswap/models';
import { LabelComponentProps } from '@shared/components';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

const WHITELISTED_LABEL = {
  status: ActiveStatus.ACTIVE,
  filled: true,
  label: i18n.t('common|whiteListed'),
  DTI: 'whitelisted'
};

export const defineWhitelistedItemLabel = (item: StableswapDividendsItemModel): Nullable<LabelComponentProps> =>
  item.isWhitelisted ? WHITELISTED_LABEL : null;
