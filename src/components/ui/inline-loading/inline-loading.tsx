import { ColorModes, ColorThemeContext } from "@quipuswap/ui-kit";
import { useContext } from "react";
import s from './inline-loading.module.scss';
import cx from 'classnames';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const InlineLoading = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s["inline-loading"], modeClass[colorThemeMode]) }>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
      <div className={s.dash}></div>
    </div>
  )
}