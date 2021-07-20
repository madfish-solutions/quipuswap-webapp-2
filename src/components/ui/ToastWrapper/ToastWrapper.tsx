import React, { useCallback, useContext } from 'react';
import cx from 'classnames';
import {
  ToastClassName,
  ToastContainer,
  TypeOptions,
} from 'react-toastify';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
// import ToastError from '@icons/ToastError.svg';

import s from './ToastWrapper.module.sass';

const CustomCloseButton = ({
  children,
  type,
  closeToast,
  ...props
}: any) => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeToast(e);
  }, [closeToast]);

  return (
    <button
      {...props}
      type="button"
      className={s.closeButton}
      onClick={handleClick}
    >
      {/* Close icon */}
    </button>
  );
};

type ToastWrapperProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const typeDependentClassNames: Partial<Record<TypeOptions, string>> = {
  success: s.success,
  error: s.error,
  info: s.info,
};

const getToastClassName: Exclude<ToastClassName, string> = (context) => cx(
  context?.type && typeDependentClassNames[context?.type],
);

export const ToastWrapper: React.FC<ToastWrapperProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <ToastContainer
      autoClose={5000}
      hideProgressBar
      position="top-center"
      className={cx(modeClass[colorThemeMode], s.notificationContainer)}
      bodyClassName={s.toastBody}
      closeButton={CustomCloseButton}
      toastClassName={cx(getToastClassName, s.notification, className)}
      pauseOnHover
      closeOnClick={false}
      pauseOnFocusLoss
    />
  );
};
