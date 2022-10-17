import {
  BridgeCategory,
  BtcCategory,
  DexTwoCategoryIcon,
  QuipuCategory,
  StableCategory,
  TezotopiaCategory
} from '@shared/svg/categories';

import { useNewLiquidityListStore } from '../../../../hooks';
import styles from './tokens-categories-filter.module.scss';

export const TokensCategoriesFilter = () => {
  const { showStable, showBridged, showQuipu, showTezotopia, showBTC, showDexTwo } = useNewLiquidityListStore();

  return (
    <div className={styles.root}>
      <StableCategory colored={showStable} />
      <BridgeCategory colored={showBridged} />
      <QuipuCategory colored={showQuipu} />
      <TezotopiaCategory colored={showTezotopia} />
      <BtcCategory colored={showBTC} />
      <DexTwoCategoryIcon colored={showDexTwo} />
    </div>
  );
};
