import { FC, MouseEvent, ReactNode } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { Nullable } from '@shared/types';

import styles from './button-or-link.module.scss';
import { ExternalLink } from '../../../../svg';
import { NavigationDataProps } from '../navigation-data';

interface Props {
  link: NavigationDataProps;
  icon?: Nullable<ReactNode>;
  className: string;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onFocus?: () => void;
}

export const ButtonOrLink: FC<Props> = ({ link, className, onFocus, onClick, icon, ...props }) => {
  if (link.target) {
    return (
      <a
        key={link.id}
        href={link.to}
        className={cx(styles.root, className)}
        target={link.target}
        rel="noreferrer noopener"
        onFocus={onFocus}
        onClick={onClick}
        {...props}
      >
        <span className={styles.name}>
          {icon}
          {link.label}
          {link.status}
        </span>
        <ExternalLink className={styles.externalLinkIcon} />
      </a>
    );
  }

  return (
    <Link
      key={link.id}
      to={link.to}
      className={className}
      target={link.target}
      onFocus={onFocus}
      onClick={onClick}
      {...props}
    >
      {icon}
      {link.label}
      {link.status}
    </Link>
  );
};
