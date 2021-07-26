import React, { useContext } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { PopupClose } from '@components/svg/PopupClose';

import s from './Modal.module.sass';

type ModalProps = {
  innerClassName?: string
  withCloseButton?: boolean
  containerClassName?: string
  modalClassName?: string
  contentClassName?:string,
  cardClassName?:string,
  header?:React.ReactNode,
  footer?:React.ReactNode,
  title?:string
} & ReactModal.Props;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Modal: React.FC<ModalProps> = ({
  className,
  overlayClassName,
  portalClassName,
  isOpen,
  onRequestClose,
  children,
  innerClassName,
  modalClassName,
  containerClassName,
  contentClassName,
  cardClassName,
  title = '',
  header,
  footer,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <ReactModal
      className={cx(s.root, className)}
      appElement={
        typeof window !== 'undefined'
          ? document.querySelector('#__next')!
          : undefined
      }
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={cx(s.overlay, modeClass[colorThemeMode], overlayClassName)}
      portalClassName={cx(s.portal, { [s.hidden]: !isOpen }, portalClassName)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cx(s.wrapper, modalClassName)}
        onClick={(e) => {
          if (e.target === e.currentTarget && onRequestClose) {
            onRequestClose(e);
          }
        }}
      >
        <div className={cx(s.container, containerClassName)}>
          <Card
            className={cardClassName}
            contentClassName={cx(contentClassName, s.modalCard)}
            header={{
              content: <h5>{title}</h5>,
              button: (
                <Button
                  className={s.closeButton}
                  onClick={onRequestClose}
                  theme="quaternary"
                >
                  <PopupClose />
                </Button>
              ),
            }}
            additional={header}
            footer={footer}
          >
            {children}
          </Card>
        </div>
      </div>
    </ReactModal>
  );
};
