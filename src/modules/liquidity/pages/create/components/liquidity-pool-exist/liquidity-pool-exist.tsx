import { FC } from 'react';

import { Button } from '@shared/components';
import { useTranslation } from '@translation';

interface Props {
  existingPoolLink: string;
  className?: string;
}

export const LiquidityPoolExist: FC<Props> = ({ className, existingPoolLink }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div>{t('newLiquidity|poolAlreadyExists')}</div>{' '}
      <Button theme="inverse" href={existingPoolLink}>
        {t('newLiquidity|here')}
      </Button>
    </div>
  );
};
