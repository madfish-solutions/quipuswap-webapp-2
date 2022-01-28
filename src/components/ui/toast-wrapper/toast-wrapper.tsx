import React, { ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext, Loader, ToastError, ToastSuccess } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { ToastContainer, ToastContentProps, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ToastClose } from '@components/svg/toast-close';

import { Button } from '../elements/button';
import s from './toast-wrapper.module.sass';

const CustomCloseButton = ({ closeToast }: Pick<ToastContentProps, 'closeToast'>) => (
  <Button className={s.closeButton} onClick={closeToast} theme="quaternary">
    <ToastClose />
  </Button>
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const ToastWrapper: React.FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <ToastContainer
      autoClose={5000}
      limit={3}
      hideProgressBar
      position="top-center"
      className={cx(modeClass[colorThemeMode], s.notificationContainer)}
      bodyClassName={s.toastBody}
      closeButton={CustomCloseButton}
      toastClassName={s.notification}
      pauseOnHover
      closeOnClick={false}
      pauseOnFocusLoss
      icon={false}
    />
  );
};

export const toastContent = (children: ReactNode, type?: TypeOptions | null) => {
  let icon;

  if (type && type !== 'default') {
    if (type === 'info') {
      icon = <Loader className={s.icon} />;
    }
    if (type === 'success') {
      icon = <ToastSuccess className={s.icon} />;
    }
    if (type === 'error') {
      icon = <ToastError className={s.icon} />;
    }
  }

  return (
    <>
      {icon}
      {children}
    </>
  );
};
