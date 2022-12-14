import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle } from '@shared/components';
import { getTokensNames } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useLiquidityV3ItemTokens } from '../../../../hooks';

interface Props {
  dataTestId: string;
  titleText: string;
}

export const PageTitleContainer: FC<Props> = observer(({ dataTestId, titleText }) => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  // eslint-disable-next-line no-console
  console.log(tokenX, tokenY);

  const title = tokenX && tokenY ? `${titleText} ${getTokensNames([tokenX, tokenY])}` : t('common|loading');

  return <PageTitle data-test-id={dataTestId}>{title}</PageTitle>;
});
