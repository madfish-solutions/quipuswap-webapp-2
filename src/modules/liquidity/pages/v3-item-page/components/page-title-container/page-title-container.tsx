import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { SLASH } from '@config/constants';
import { PageTitle } from '@shared/components';
import { getTokenSymbol } from '@shared/helpers';
import { useToken } from '@shared/hooks';
import { mapTokenAddress } from '@shared/mapping';
import { useTranslation } from '@translation';

import { useLiquidityV3ItemStore } from '../../../../hooks';

export const PageTitleContainer: FC = observer(() => {
  const { t } = useTranslation();
  const { item } = useLiquidityV3ItemStore();
  const tokenX = useToken(item ? mapTokenAddress(item.constants.token_x) : null);
  const tokenY = useToken(item ? mapTokenAddress(item.constants.token_y) : null);

  const title =
    tokenX && tokenY
      ? `${t('liquidity|Liquidity')} ${getTokenSymbol(tokenX)} ${SLASH} ${getTokenSymbol(tokenY)}`
      : t('common|loading');

  return <PageTitle data-test-id="v3LiqTitle">{title}</PageTitle>;
});
