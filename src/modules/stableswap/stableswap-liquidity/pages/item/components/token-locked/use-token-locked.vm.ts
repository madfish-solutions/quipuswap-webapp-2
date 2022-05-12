import { useTranslation } from '@translation';

export const useTokenLockedViewModel = (tokenSymbol: string) => {
  const { t } = useTranslation();

  return t('stableswap|Token {{tokenSymbol}} locked', { tokenSymbol });
};
