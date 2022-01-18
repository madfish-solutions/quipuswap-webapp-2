import React, { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './new-pair-message.module.sass';

interface NewPairMessageProps {
  className?: string;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const NewPairMessage: FC<NewPairMessageProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(className, s.pairMessage, themeClass[colorThemeMode]);

  return <div className={compoundClassName}>Note! The pool doesn't exist. You will create the new one.</div>;
};
