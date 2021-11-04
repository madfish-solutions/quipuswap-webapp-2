import React, { useContext, useState } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { Button } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
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
  const [start, setStart] = useState<any>();

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
        onMouseUp={(e) => {
          if (!start && e.target === e.currentTarget && onRequestClose) {
            onRequestClose(e);
          }
          setStart(undefined);
        }}
      >
        <div
          aria-hidden="true"
          onMouseDown={(e) => {
            setStart(e.target);
          }}
          className={cx(s.container, containerClassName)}
        >
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
