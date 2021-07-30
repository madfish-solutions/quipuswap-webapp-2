import React, { useContext } from 'react';
import cx from 'classnames';
import Tippy from '@tippyjs/react/headless'; // different import path!
import { Placement } from 'tippy.js';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import TooltipPointer from '@icons/TooltipPointer.svg';
import s from './Tooltip.module.sass';

type TooltipProps = {
  content: React.ReactNode,
  placement?: Placement
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Tooltip: React.FC<TooltipProps> = ({ children, content, placement }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const placementClassName = placement ? s[placement] : '';

  return (
    <Tippy
      placement={placement}
      render={(attrs:any) => (
        <div {...attrs} className={cx(modeClass[colorThemeMode], s.tippyPopup, placementClassName)}>
          {content}
          <TooltipPointer className={s.arrow} />
        </div>
      )}
    >
      <div className={s.tippy}>
        {/* for debug */}
        {/* <div
          data-popper-placement={placement}
          className={cx(modeClass[colorThemeMode], s.tippyPopup, placementClassName)}
        >
          {content}
          <TooltipPointer className={s.arrow} />
        </div> */}
        <div className={cx(modeClass[colorThemeMode], s.tippyContent)}>
          {children}
        </div>

      </div>
    </Tippy>
  );
};
