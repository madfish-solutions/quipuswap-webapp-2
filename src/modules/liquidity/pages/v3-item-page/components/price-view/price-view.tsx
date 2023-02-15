import { FC } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { useShouldShowTokenXToYPrice } from '../../hooks';
import styles from './price-view.module.scss';

interface PriceViewProps {
  textClassName?: string;
  price: Nullable<BigNumber>;
}

export const PriceView: FC<PriceViewProps> = observer(({ textClassName, price }) => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const shouldShowTokenXToYPrice = useShouldShowTokenXToYPrice();

  if (isNull(tokenX) || isNull(tokenY)) {
    return null;
  }

  const leftCurrency = getTokenSymbol(shouldShowTokenXToYPrice ? tokenY : tokenX);
  const rightCurrency = getTokenSymbol(shouldShowTokenXToYPrice ? tokenX : tokenY);
  const displayedPrice = shouldShowTokenXToYPrice ? price?.pow(-1) : price;

  return (
    <div className={styles.root}>
      <StateCurrencyAmount amount="1" className={textClassName} currency={leftCurrency} />
      <span className={cx(textClassName, styles.equalSign)}>=</span>
      <StateCurrencyAmount amount={displayedPrice} className={textClassName} currency={rightCurrency} />
    </div>
  );
});
