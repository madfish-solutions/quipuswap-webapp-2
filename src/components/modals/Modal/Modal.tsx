import React, { useContext, useState } from 'react';

import { Card } from '@quipuswap/ui-kit';
import cx from 'classnames';
import ReactModal from 'react-modal';

import { Button } from '@components/ui/elements/button';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { PopupClose } from '../../svg/PopupClose';
import s from './Modal.module.sass';

export interface ModalProps extends ReactModal.Props {
  innerClassName?: string;
  withCloseButton?: boolean;
  containerClassName?: string;
  modalClassName?: string;
  contentClassName?: string;
  cardClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
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
  const [start, setStart] = useState();

  // eslint-disable-next-line
  const appElement: any = typeof window !== 'undefined' ? document.querySelector('#__next')! : undefined;

  return (
    <ReactModal
      className={cx(s.root, className)}
      appElement={appElement}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={cx(s.overlay, modeClass[colorThemeMode], overlayClassName)}
      portalClassName={cx(s.portal, { [s.hidden]: !isOpen }, portalClassName)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cx(s.wrapper, modalClassName)}
        onMouseUp={e => {
          if (!start && e.target === e.currentTarget && onRequestClose) {
            onRequestClose(e);
          }
          setStart(undefined);
        }}
      >
        <div
          aria-hidden="true"
          onMouseDown={e => {
            // @ts-ignore
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
                <Button className={s.closeButton} onClick={onRequestClose} theme="quaternary">
                  <PopupClose />
                </Button>
              )
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
