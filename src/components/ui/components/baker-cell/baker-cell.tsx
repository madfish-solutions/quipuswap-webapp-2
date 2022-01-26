import React, { useContext } from 'react';

import { TokensLogos, ColorModes, ColorThemeContext, TEZOS_TOKEN, Baker } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Tooltip } from '../tooltip';
import s from './baker-cell.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface BakerCellProps {
  bakerFee: string;
  bakerFreeSpace: string;
  bakerLogo: string;
  bakerName: string;
  tabIndex?: number;
  onClick?: () => void;
  feeTooltipText?: string;
  feeLabel?: string;
  spaceTooltipText?: string;
  spaceLabel?: string;
}

enum Key {
  ENTER = 'Enter'
}

export const BakerCell: React.FC<BakerCellProps> = ({
  bakerFee,
  bakerFreeSpace,
  bakerName,
  bakerLogo,
  onClick,
  tabIndex,
  feeLabel = 'Fee',
  feeTooltipText = 'The fee this baker will charge on your baking reward.',
  spaceLabel = 'Space',
  spaceTooltipText = 'The max amount you can delegate to a specific baker.'
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(modeClass[colorThemeMode], s.listItem);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyUp={e => {
        if (e.key === Key.ENTER && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={compoundClassName}
    >
      <div className={s.bakerFlexCell}>
        {bakerLogo ? (
          <TokensLogos firstTokenIcon={bakerLogo} firstTokenSymbol={bakerName} />
        ) : (
          <Baker className={s.bakerIcon} />
        )}
        <h6 className={cx(s.h6, s.bakerName)} title={bakerName}>
          {bakerName}
        </h6>
      </div>
      {bakerFee && (
        <div className={s.bakerFlexCell}>
          <div className={s.bakerBlock}>
            <div className={s.caption}>
              {feeLabel}
              <Tooltip content={feeTooltipText} />
            </div>
            <div className={s.label1}>{bakerFee} %</div>
          </div>
          <div className={s.bakerBlock}>
            <div className={s.caption}>
              {spaceLabel}
              <Tooltip content={spaceTooltipText} />
            </div>
            <div>
              <span className={s.label1}>{bakerFreeSpace}</span>{' '}
              <span className={s.bodyTextLink1}>{TEZOS_TOKEN.metadata.symbol}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
