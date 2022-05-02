/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-type-alias */
import { FC, ReactNode, useContext, useState } from 'react';

import cx from 'classnames';
import ReactModal from 'react-modal';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { PopupClose } from '@shared/svg';

import styles from './modal.module.scss';

export type ModalProps = {
  innerClassName?: string;
  withCloseButton?: boolean;
  containerClassName?: string;
  modalClassName?: string;
  contentClassName?: string;
  cardClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
  title?: string;
} & ReactModal.Props;

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
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
  const [start, setStart] = useState<any>();

  return (
    <ReactModal
      className={cx(styles.root, className)}
      appElement={typeof window !== 'undefined' ? document.getElementById('root')! : undefined}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={cx(styles.overlay, modeClass[colorThemeMode], overlayClassName)}
      portalClassName={cx(styles.portal, { [styles.hidden]: !isOpen }, portalClassName)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cx(styles.wrapper, modalClassName)}
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
            setStart(e.target);
          }}
          className={cx(styles.container, containerClassName)}
        >
          <Card
            className={cardClassName}
            contentClassName={cx(contentClassName, styles.modalCard)}
            header={{
              content: <h5 data-test-id="cardTitle">{title}</h5>,
              button: (
                <Button
                  className={styles.closeButton}
                  onClick={onRequestClose}
                  theme="quaternary"
                  data-test-id="closeButton"
                >
                  <PopupClose />
                </Button>
              )
            }}
            additional={header}
            footer={footer}
            data-test-id="modalCard"
          >
            {children}
          </Card>
        </div>
      </div>
    </ReactModal>
  );
};
