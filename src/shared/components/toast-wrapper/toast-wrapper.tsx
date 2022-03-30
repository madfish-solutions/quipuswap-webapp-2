import { FC, ReactNode, useContext } from 'react';

import cx from 'classnames';
import { ToastContainer, ToastContentProps, TypeOptions } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components/button';
import { Loader } from '@shared/components/loader';
import { CloseIcon } from '@shared/svg/close-icon';
import { ToastError } from '@shared/svg/toast-error';
import { ToastSuccess } from '@shared/svg/toast-success';

import styles from './toast-wrapper.module.scss';

const CustomCloseButton = ({ closeToast }: Pick<ToastContentProps, 'closeToast'>) => (
  <Button className={styles.closeButton} onClick={closeToast} theme="quaternary">
    <CloseIcon />
  </Button>
);

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const ToastWrapper: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <ToastContainer
      autoClose={5000}
      limit={3}
      hideProgressBar
      position="top-center"
      className={cx(modeClass[colorThemeMode], styles.notificationContainer)}
      bodyClassName={styles.toastBody}
      closeButton={CustomCloseButton}
      toastClassName={styles.notification}
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
      icon = <Loader className={styles.icon} />;
    }
    if (type === 'success') {
      icon = <ToastSuccess className={styles.icon} />;
    }
    if (type === 'error') {
      icon = <ToastError className={styles.icon} />;
    }
  }

  return (
    <>
      {icon}
      {children}
    </>
  );
};
