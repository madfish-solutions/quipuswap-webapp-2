import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { NewLabel } from '@modules/farming/pages/item/components/new-label';
import { NewLiquidityLables } from '@modules/new-liquidity/components';
import { NewLiquidityLablesInterface } from '@modules/new-liquidity/interfaces';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { isEmptyArray, isUndefined } from '@shared/helpers';
import { ArrowDown, VisibleIcon } from '@shared/svg';
import { Token } from '@shared/types';

import { Card } from '../card';
import { Iterator } from '../iterator';
import { LabelComponent, LabelComponentProps } from '../label-component';
import { StateListItemCardCell, StateListItemCardCellProps } from '../state-list-item-card-cell';
import { TokensLogos } from '../tokens-logo';
import { TokensSymbols } from '../tokens-symbols';
import styles from './list-item-card.module.scss';

interface Props {
  href: string;
  inputToken: Token | Array<Token>;
  status: LabelComponentProps;
  isNew?: boolean;
  labels?: Array<LabelComponentProps>;
  outputToken?: Token | Array<Token>;
  isNewLiquidity?: boolean;
  visibleIcon?: boolean;
  newLiquidityLablesData?: NewLiquidityLablesInterface;
  itemStats: Array<StateListItemCardCellProps>;
  userStats?: Array<StateListItemCardCellProps>;
  farmingItemDTI?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const ListItemCard: FC<Props> = ({
  inputToken,
  outputToken,
  href,
  labels,
  isNewLiquidity,
  visibleIcon,
  newLiquidityLablesData,
  status,
  isNew,
  itemStats,
  userStats,
  farmingItemDTI
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const shouldOutputTokensRender =
    (Array.isArray(outputToken) && !isEmptyArray(outputToken)) || !isUndefined(outputToken);

  return (
    <Link to={href} data-test-id={farmingItemDTI}>
      <Card className={cx(styles.root, modeClass[colorThemeMode])} isV2>
        {isNew && <NewLabel />}

        <div className={styles.topContainer}>
          <div className={styles.logosAndSymbols}>
            <div className={cx(styles.logosContainer, { [styles.inlineIcons]: isNewLiquidity })}>
              <TokensLogos tokens={inputToken} width={32} />
              {visibleIcon && <VisibleIcon />}
              {shouldOutputTokensRender && (
                <div className={styles.ouputTokenContainer}>
                  <ArrowDown className={styles.arrow} />
                  <span className={styles.earn}>Earn</span>
                  <TokensLogos tokens={outputToken} width={24} />
                </div>
              )}
            </div>

            <div className={styles.symbolsContainer}>
              <TokensSymbols className={styles.tokensSymbols} tokens={inputToken} />
              {shouldOutputTokensRender && (
                <div className={styles.ouputTokenContainer}>
                  <ArrowDown className={styles.arrow} />
                  <span className={styles.earn}>Earn</span>
                  <TokensSymbols className={styles.tokensSymbols} tokens={outputToken} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.statusAndlabelsContainer}>
            {!isNewLiquidity && <LabelComponent {...status} />}
            {newLiquidityLablesData && <NewLiquidityLables newLiquidityLablesData={newLiquidityLablesData} />}
            {!isUndefined(labels) && !isEmptyArray(labels) && (
              <div className={styles.labelsContainer}>
                <Iterator render={LabelComponent} data={labels} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsContainer}>
          <Iterator render={StateListItemCardCell} data={itemStats} />
          {!isUndefined(userStats) && !isEmptyArray(userStats) && (
            <Iterator render={StateListItemCardCell} data={userStats} />
          )}
        </div>
      </Card>
    </Link>
  );
};
