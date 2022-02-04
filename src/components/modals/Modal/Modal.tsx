import { FC, MouseEvent, ReactNode, useContext, useState } from 'react';

import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import ReactModal, { Props } from 'react-modal';

import { Button } from '@components/ui/elements/button';

import { PopupClose } from '../../svg/PopupClose';
import s from './Modal.module.sass';

export interface ModalProps extends Props {
  innerClassName?: string;
  withCloseButton?: boolean;
  containerClassName?: string;
  modalClassName?: string;
  contentClassName?: string;
  cardClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
  title?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Modal: FC<ModalProps> = ({
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
  const [start, setStart] = useState<EventTarget>();

  // eslint-disable-next-line
  const appElement: any = typeof window !== 'undefined' ? document.querySelector('#__next')! : undefined;

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    if (!start && event.target === event.currentTarget && onRequestClose) {
      onRequestClose(event);
    }
    setStart(undefined);
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    setStart(event.target);
  };

  const headerElement = {
    content: <h5>{title}</h5>,
    button: (
      <Button className={s.closeButton} onClick={onRequestClose} theme="quaternary">
        <PopupClose />
      </Button>
    )
  };

  const overlayClass = cx(s.overlay, modeClass[colorThemeMode], overlayClassName);
  const portalClass = cx(s.portal, { [s.hidden]: !isOpen }, portalClassName);

  return (
    <ReactModal
      className={cx(s.root, className)}
      appElement={appElement}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={overlayClass}
      portalClassName={portalClass}
      {...props}
    >
      <div aria-hidden="true" className={cx(s.wrapper, modalClassName)} onMouseUp={handleMouseUp}>
        <div aria-hidden="true" onMouseDown={handleMouseDown} className={cx(s.container, containerClassName)}>
          <Card
            className={cardClassName}
            contentClassName={cx(contentClassName, s.modalCard)}
            header={headerElement}
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
