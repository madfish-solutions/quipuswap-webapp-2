import { FC, HTMLProps, ReactNode, useContext, useLayoutEffect, useRef } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { LabelComponent } from '@shared/components/status-label';
import { ActiveStatus } from '@shared/types';

import styles from './card.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  className?: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    status?: ActiveStatus;
    className?: string;
  };
  subheader?: {
    content: ReactNode;
    button?: ReactNode;
    status?: ActiveStatus;
    className?: string;
  };
  banner?: string;
  additional?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  footerClassName?: string;
  isV2?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Card: FC<Props> = ({
  className,
  header,
  subheader,
  additional,
  footer,
  children,
  isV2 = false,
  contentClassName,
  banner,
  footerClassName,
  ...props
}) => {
  const container = useRef<HTMLDivElement>(null);

  const { colorThemeMode } = useContext(ColorThemeContext);

  const rootClassName = cx(styles.root, { [styles.banner]: banner }, modeClass[colorThemeMode], className);

  useLayoutEffect(() => {
    container.current?.style.setProperty('--banner', JSON.stringify(`${banner}`));
  }, [banner]);

  if (isV2) {
    return (
      <div ref={container} className={rootClassName}>
        {children}
      </div>
    );
  }

  return (
    <div ref={container} className={rootClassName} {...props}>
      {header && (
        <div className={cx(styles.header, header.className)}>
          <span data-test-id="headerContent">{header.content}</span>
          <span data-test-id="labelCard">
            <span data-test-id="label">{header.status ? <LabelComponent filled status={header.status} /> : null}</span>
          </span>
          {header.button}
        </div>
      )}
      {subheader && (
        <div className={cx(styles.header, subheader.className)}>
          <span data-test-id="headerContent">{subheader.content}</span>
          <span data-test-id="labelCard">
            <span data-test-id="label">
              {subheader.status ? <LabelComponent filled status={subheader.status} /> : null}
            </span>
          </span>
          {subheader.button}
        </div>
      )}
      {additional && <div className={styles.additional}>{additional}</div>}
      <div className={cx(styles.content, contentClassName)}>{children}</div>
      {footer && <div className={cx(styles.footer, footerClassName)}>{footer}</div>}
    </div>
  );
};
