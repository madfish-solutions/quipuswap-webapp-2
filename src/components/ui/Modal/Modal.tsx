import React, { useContext, useState } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';

import { isClient } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import {
  Card, CardAdditional, CardContent, CardFooter, CardHeader,
} from '@components/ui/Card';
import { PopupClose } from '@components/svg/PopupClose';

import s from './Modal.module.sass';

type ModalProps = {
  innerClassName?: string
  withCloseButton?: boolean
  containerClassName?: string
  modalClassName?: string
  contentClassName?:string,
  headerClassName?:string,
  cardClassName?:string,
  additional?:React.ReactNode,
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
  headerClassName,
  cardClassName,
  title = '',
  header,
  additional,
  footer,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [start, setStart] = useState<any>();

  return (
    <ReactModal
      className={cx(s.root, className)}
      appElement={
        isClient
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
          <Card isV2 className={cardClassName}>
            <CardHeader
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
            />
            {header && (<CardHeader className={headerClassName} header={{ content: header }} />)}
            {additional && (
            <CardAdditional>
              {additional}
            </CardAdditional>
            )}
            <CardContent className={cx(contentClassName, s.modalCard)}>
              {children}
            </CardContent>
            {footer && (
            <CardFooter>
              {footer}
            </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </ReactModal>
  );
};
