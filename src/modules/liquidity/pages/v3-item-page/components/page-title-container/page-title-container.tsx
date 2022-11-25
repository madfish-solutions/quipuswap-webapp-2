import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle } from '@shared/components';
import { getTokensNames } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useLiquidityV3ItemTokens } from '../../../../hooks';

export const PageTitleContainer: FC = observer(() => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const title =
    tokenX && tokenY ? `${t('liquidity|Liquidity')} ${getTokensNames([tokenX, tokenY])}` : t('common|loading');

  return <PageTitle data-test-id="v3LiqTitle">{title}</PageTitle>;
});
