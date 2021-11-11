import React, { ReactNode, useContext } from 'react';
import {
  TypeOptions,
  ToastContainer,
  ToastContentProps,
} from 'react-toastify';
import cx from 'classnames';
import 'react-toastify/dist/ReactToastify.css';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ToastClose } from '@components/svg/ToastClose';
import ToastSuccess from '@icons/ToastSuccess.svg';
import ToastError from '@icons/ToastError.svg';

import { Button } from '../Button';
import { Loader } from '../Table';
import s from './ToastWrapper.module.sass';

const CustomCloseButton = ({ closeToast }: Pick<ToastContentProps, 'closeToast'>) => (
  <Button
    className={s.closeButton}
    onClick={closeToast}
    theme="quaternary"
  >
    <ToastClose />
  </Button>
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
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
    />
  );
};

export const toastContent = (
  children: ReactNode,
  type?: TypeOptions | null,
) => {
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
