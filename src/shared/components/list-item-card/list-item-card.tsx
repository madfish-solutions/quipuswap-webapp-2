import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { NewLabel } from '@modules/farming/pages/item/components/new-label';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { ArrowDown } from '@shared/svg';
import { Token } from '@shared/types';

import { Card } from '../card';
import { Iterator } from '../iterator';
import { StateListItemCardCell, StateListItemCardCellProps } from '../state-list-item-card-cell';
import { StatusLabel, StatusLabelProps } from '../status-label';
import { TokensLogos } from '../tokens-logo';
import { TokensSymbols } from '../tokens-symbols';
import styles from './list-item-card.module.scss';

interface Props {
  href: string;
  inputToken: Token | Array<Token>;
  status: StatusLabelProps;
  isNew?: boolean;
  labels?: Array<StatusLabelProps>;
  outputToken?: Token | Array<Token>;
  itemStats: Array<StateListItemCardCellProps>;
  userStats?: Array<StateListItemCardCellProps>;
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
  status,
  isNew,
  itemStats = [],
  userStats = []
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Link to={href}>
      <Card className={cx(styles.root, modeClass[colorThemeMode])} isV2>
        {isNew && <NewLabel />}

        <div className={styles.topContainer}>
          <div className={styles.logosAndSymbols}>
            <div className={styles.logosContainer}>
              <TokensLogos tokens={inputToken} width={32} />

              {outputToken && (
                <div className={styles.ouputTokenContainer}>
                  <ArrowDown className={styles.arrow} />
                  <span className={styles.earn}>Earn</span>
                  <TokensLogos tokens={outputToken} width={24} />
                </div>
              )}
            </div>

            <div className={styles.symbolsContainer}>
              <TokensSymbols className={styles.tokensSymbols} tokens={inputToken} />
              {outputToken && (
                <div className={styles.ouputTokenContainer}>
                  <ArrowDown className={styles.arrow} />
                  <span className={styles.earn}>Earn</span>
                  <TokensSymbols className={styles.tokensSymbols} tokens={outputToken} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.statusAndlabelsContainer}>
            <StatusLabel {...status} />
            {labels && (
              <div className={styles.labelsContainer}>
                <Iterator render={StatusLabel} data={labels} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsContainer}>
          <Iterator render={StateListItemCardCell} data={itemStats} />
          {userStats && <Iterator render={StateListItemCardCell} data={userStats} />}
        </div>
      </Card>
    </Link>
  );
};
