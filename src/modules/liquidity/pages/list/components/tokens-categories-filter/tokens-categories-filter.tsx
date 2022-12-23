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
  TezotopiaCategory,
  V3Category
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
    showV3,
    toggleShowStable,
    toggleShowBridged,
    toggleShowQuipu,
    toggleShowTezotopia,
    toggleShowBTC,
    toggleShowDexTwo,
    toggleShowV3,
    translation
  } = useTokensCategoriesFilter();

  // TODO Remove it after adding all categories
  const isShowDexTwo = false;

  return (
    <div className={cx(className, styles.root)}>
      <Tooltip content={translation.tooltipStableSwap}>
        <div>
          <Button theme="quaternary" onClick={toggleShowStable}>
            <StableCategory colored={showStable} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content={translation.tooltipBridge}>
        <div>
          <Button theme="quaternary" onClick={toggleShowBridged}>
            <BridgeCategory colored={showBridged} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content={translation.tooltipQuipu}>
        <div>
          <Button theme="quaternary" onClick={toggleShowQuipu}>
            <QuipuCategory colored={showQuipu} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content={translation.tooltipTezotopia}>
        <div>
          <Button theme="quaternary" onClick={toggleShowTezotopia}>
            <TezotopiaCategory colored={showTezotopia} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content={translation.tooltipBTC}>
        <div>
          <Button theme="quaternary" onClick={toggleShowBTC}>
            <BtcCategory colored={showBTC} />
          </Button>
        </div>
      </Tooltip>
      <Tooltip content={translation.tooltipV3}>
        <div>
          <Button theme="quaternary" onClick={toggleShowV3}>
            <V3Category colored={showV3} />
          </Button>
        </div>
      </Tooltip>
      {isShowDexTwo && (
        <Tooltip content={translation.tooltipDexTwo}>
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
