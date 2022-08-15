import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { PERCENT } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { OpportunityTicket } from '@shared/svg';
import { Optional } from '@shared/types';

import styles from './opportunity.module.scss';

interface Props {
  index?: number | string;
  href: string;
  apr: Optional<BigNumber.Value>;
}

export const Opportunity: FC<Props> = ({ apr, href, index = 1 }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Link
      className={cx(styles.root, {
        [styles.dark]: colorThemeMode === ColorModes.Dark,
        [styles.light]: colorThemeMode === ColorModes.Light
      })}
      to={href}
    >
      <span className={styles.leftWrapper}>
        <span className={styles.earnExtra}>
          Earn extra
          <StateCurrencyAmount
            amount={apr}
            currency={PERCENT}
            className={styles.stateCurrencyAmount}
            amountClassName={styles.amountClassName}
            currencyClassName={styles.currencyClassName}
          />
        </span>
        <span className={styles.aprOnQs}>APR on Quipuswap</span>
      </span>
      <span className={styles.opportunityText}>
        Opportunity
        <span className={styles.index}># {index}</span>
      </span>
      <OpportunityTicket className={styles.ticket} />
    </Link>
  );
};
