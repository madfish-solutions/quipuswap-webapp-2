import React from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';

import Close from '@icons/Close.svg';

import s from './Modal.module.sass';
import { Button } from '../Button';

type ModalProps = {
  innerClassName?: string;
  theme?: keyof typeof themeClass
  withCloseButton?: boolean
  containerClassName?: string
} & ReactModal.Props;

const themeClass = {
  primary: s.primary,
  secondary: s.secondary,
};

export const Modal: React.FC<ModalProps> = ({
  className,
  theme = 'primary',
  overlayClassName,
  portalClassName,
  isOpen,
  onRequestClose,
  children,
  innerClassName,
  withCloseButton = false,
  containerClassName,
  ...props
}) => {
  const compoundRootClassName = cx(
    s.root,
    className,
  );

  const compoundContainerClassName = cx(
    s.container,
    { [s.withCloseButton]: withCloseButton },
    themeClass[theme],
    containerClassName,
  );

  return (
    <ReactModal
      className={compoundRootClassName}
      appElement={
        typeof window !== 'undefined'
          ? document.querySelector('#__next')!
          : undefined
      }
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={cx(s.overlay, overlayClassName)}
      portalClassName={cx(s.portal, { [s.hidden]: !isOpen }, portalClassName)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={s.wrapper}
        onClick={(e) => {
          if (e.target === e.currentTarget && onRequestClose) {
            onRequestClose(e);
          }
        }}
      >
        <div className={compoundContainerClassName}>
          <div className={cx(s.inner, innerClassName)}>
            {withCloseButton && (
              <Button
                className={s.closeButton}
                onClick={onRequestClose}
              >
                <Close />
              </Button>
            )}
            {children}
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
