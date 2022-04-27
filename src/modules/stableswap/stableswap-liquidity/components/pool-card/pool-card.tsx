import { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, NewTokensLogos, TokensSymbols } from '@shared/components';

import styles from './pool-card.module.scss';
import { usePoolCardViewModel } from './pool-card.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const PoolCard = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { tokens, preparelogos } = usePoolCardViewModel();

  return (
    <Card className={modeClass[colorThemeMode]} contentClassName={styles.poolCard}>
      <div className={styles.info}>
        <NewTokensLogos tokens={preparelogos(tokens)} width={48} />
        <TokensSymbols className={styles.tokensLogos} tokens={tokens} />
      </div>
      <div className={styles.stats}>Stats</div>
    </Card>
  );
};
