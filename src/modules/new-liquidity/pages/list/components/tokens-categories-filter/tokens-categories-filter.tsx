import { observer } from 'mobx-react-lite';

import { Button } from '@shared/components';
import {
  BridgeCategory,
  BtcCategory,
  DexTwoCategoryIcon,
  QuipuCategory,
  StableCategory,
  TezotopiaCategory
} from '@shared/svg/categories';

import styles from './tokens-categories-filter.module.scss';
import { useTokensCategoriesFilter } from './tokens-categories-filter.vm';

export const TokensCategoriesFilter = observer(() => {
  const {
    showStable,
    showBridged,
    showQuipu,
    showTezotopia,
    showBTC,
    showDexTwo,
    toggleShowStable,
    toggleShowBridged,
    toggleShowQuipu,
    toggleShowTezotopia,
    toggleShowBTC,
    toggleShowDexTwo
  } = useTokensCategoriesFilter();

  return (
    <div className={styles.root}>
      <Button theme="quaternary" onClick={toggleShowStable}>
        <StableCategory colored={showStable} />
      </Button>
      <Button theme="quaternary" onClick={toggleShowBridged}>
        <BridgeCategory colored={showBridged} />
      </Button>
      <Button theme="quaternary" onClick={toggleShowQuipu}>
        <QuipuCategory colored={showQuipu} />
      </Button>
      <Button theme="quaternary" onClick={toggleShowTezotopia}>
        <TezotopiaCategory colored={showTezotopia} />
      </Button>
      <Button theme="quaternary" onClick={toggleShowBTC}>
        <BtcCategory colored={showBTC} />
      </Button>
      <Button theme="quaternary" onClick={toggleShowDexTwo}>
        <DexTwoCategoryIcon colored={showDexTwo} />
      </Button>
    </div>
  );
});
