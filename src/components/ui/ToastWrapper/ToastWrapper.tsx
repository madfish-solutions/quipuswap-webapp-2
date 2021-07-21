import React, { useCallback, useContext } from 'react';
import cx from 'classnames';
import {
  ToastClassName,
  ToastContainer,
  TypeOptions,
} from 'react-toastify';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { ToastClose } from '@components/svg/ToastClose';

import s from './ToastWrapper.module.sass';

const CustomCloseButton = ({
  children,
  type,
  closeToast,
  ...props
}: any) => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeToast();
  }, [closeToast]);

  if (type !== 'error') {
    return (
      <Button
        {...props}
        className={s.closeButton}
        theme="quaternary"
      />
    );
  }
  return (
    <Button
      {...props}
      className={s.closeButton}
      onClick={handleClick}
      theme="quaternary"
    >
      <ToastClose />
    </Button>
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

const getToastClassName: Exclude<ToastClassName, string> = (context) => {
  const p = cx(
    s.notification,
    context?.type && typeDependentClassNames[context?.type],
  );
  return p;
};

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
      toastClassName={cx(getToastClassName(), className)}
      pauseOnHover
      closeOnClick={false}
      pauseOnFocusLoss
    />
  );
};
