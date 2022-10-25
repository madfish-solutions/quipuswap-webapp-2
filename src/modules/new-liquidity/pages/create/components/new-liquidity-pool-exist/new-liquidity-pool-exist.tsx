import { FC } from 'react';

import { AppRootRoutes } from '@app.router';
import { NewLiquidityRoutes } from '@modules/new-liquidity/new-liquidity-routes.enum';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { Button } from '@shared/components';
import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

interface Props {
  tokens: Token[];
  className?: string;
}

export const NewLiquidityPoolExist: FC<Props> = ({ className, tokens }) => {
  const { t } = useTranslation();

  const [aToken, bToken] = tokens;

  const link = `${AppRootRoutes.NewLiquidity}${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/${getTokenPairSlug(
    aToken,
    bToken
  )}`;

  return (
    <div className={className}>
      <div>{t('newLiquidity|poolAlreadyExists')}</div>{' '}
      <Button theme="inverse" href={link}>
        here
      </Button>
    </div>
  );
};
