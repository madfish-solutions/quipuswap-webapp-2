import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle } from '@shared/components';
import { getTokensNames } from '@shared/helpers';
import { useTranslation } from '@translation';

import styles from './page-title-container.module.scss';
import { useLiquidityV3ItemTokens } from '../../../../hooks';
import { TokensOrderSwitcher } from '../tokens-order-switcher';

interface Props {
  dataTestId: string;
  titleText: string;
  shouldShowTokensOrderSwitcher?: boolean;
}

export const PageTitleContainer: FC<Props> = observer(({ dataTestId, titleText, shouldShowTokensOrderSwitcher }) => {
  const { t } = useTranslation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const title =
    tokenX && tokenY ? (
      <>
        <span>
          {titleText} <span className={styles.poolTokens}>{getTokensNames([tokenX, tokenY])}</span>
        </span>
        {shouldShowTokensOrderSwitcher && <TokensOrderSwitcher className={styles.switcher} />}
      </>
    ) : (
      t('common|loading')
    );

  return (
    <PageTitle className={styles.root} data-test-id={dataTestId}>
      {title}
    </PageTitle>
  );
});
