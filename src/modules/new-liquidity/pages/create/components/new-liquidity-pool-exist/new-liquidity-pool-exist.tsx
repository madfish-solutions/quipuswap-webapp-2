import { FC } from 'react';

import { Button } from '@shared/components';
import { useTranslation } from '@translation';

interface Props {
  link: string;
  className?: string;
}

export const NewLiquidityPoolExist: FC<Props> = ({ className, link }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div>{t('newLiquidity|poolAlreadyExists')}</div>{' '}
      <Button theme="inverse" href={link}>
        here
      </Button>
    </div>
  );
};
