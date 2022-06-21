import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

export const useTokenLockedViewModel = (tokenSymbol: Nullable<string>) => {
  const { t } = useTranslation();

  if (isNull(tokenSymbol)) {
    return '';
  }

  return t('stableswap|Token {{tokenSymbol}} locked', { tokenSymbol });
};
