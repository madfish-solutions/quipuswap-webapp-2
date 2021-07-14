import React, { useContext } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';

import { PopupClose } from '@components/svg/PopupClose';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import s from './Modal.module.sass';
import { Button } from '../Button';
import { Card } from '../Card';

type ModalProps = {
  innerClassName?: string
  withCloseButton?: boolean
  containerClassName?: string
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
  withCloseButton = false,
  containerClassName,
  title = '',
  ...props
}) => {
  const compoundRootClassName = cx(
    s.root,
    className,
  );

  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundContainerClassName = cx(
    s.container,
    { [s.withCloseButton]: withCloseButton },
    modeClass[colorThemeMode],
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
      overlayClassName={cx(s.overlay, modeClass[colorThemeMode], overlayClassName)}
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
          <Card
            content={(
              <h5>
                {title}
              </h5>
              )}
            button={(
              <Button
                className={s.closeButton}
                onClick={onRequestClose}
                theme="quaternary"
              >
                <PopupClose />
              </Button>
              )}
          >
            {children}

          </Card>
        </div>
      </div>
    </ReactModal>
  );
};
