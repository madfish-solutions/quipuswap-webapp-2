import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button, Tooltip } from '@shared/components';
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

interface Props {
  className?: string;
}

export const TokensCategoriesFilter: FC<Props> = observer(({ className }) => {
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

  // TODO Remove it after adding all categories
  const isShowDexTwo = false;

  return (
    <div className={cx(className, styles.root)}>
      <Tooltip content="StableSwap Pools">
        <div>
          <Button theme="quaternary" onClick={toggleShowStable}>
            <StableCategory colored={showStable} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content="Pools with Bridged tokens">
        <div>
          <Button theme="quaternary" onClick={toggleShowBridged}>
            <BridgeCategory colored={showBridged} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content="Pools with Quipu">
        <div>
          <Button theme="quaternary" onClick={toggleShowQuipu}>
            <QuipuCategory colored={showQuipu} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content="Tezotopia Pools">
        <div>
          <Button theme="quaternary" onClick={toggleShowTezotopia}>
            <TezotopiaCategory colored={showTezotopia} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content="BTC Pools">
        <div>
          <Button theme="quaternary" onClick={toggleShowBTC}>
            <BtcCategory colored={showBTC} />
          </Button>
        </div>
      </Tooltip>
      {isShowDexTwo && (
        <Tooltip content="Dex 2.0 Pools">
          <div>
            <Button theme="quaternary" onClick={toggleShowDexTwo}>
              <DexTwoCategoryIcon colored={showDexTwo} />
            </Button>
          </div>
        </Tooltip>
      )}
    </div>
  );
});
