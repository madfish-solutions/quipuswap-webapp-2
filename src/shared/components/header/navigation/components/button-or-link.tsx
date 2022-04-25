import { FC, ReactNode } from 'react';

import { Link } from 'react-router-dom';

import { Nullable } from '@shared/types';

import { NavigationDataProps } from '../content';

interface Props {
  link: NavigationDataProps;
  icon?: Nullable<ReactNode>;
  className: string;
  onClick: () => void;
  onFocus?: () => void;
}

export const ButtonOrLink: FC<Props> = ({ link, className, onFocus, onClick, icon }) => {
  if (link.target) {
    return (
      <a
        key={link.id}
        href={link.to}
        className={className}
        target={link.target}
        rel="noreferrer noopener"
        onFocus={onFocus}
        onClick={onClick}
      >
        {icon}
        {link.label}
        {link.status}
      </a>
    );
  }

  return (
    <Link
      key={link.id}
      to={link.to ?? ''}
      className={className}
      target={link.target}
      onFocus={onFocus}
      onClick={onClick}
    >
      {icon}
      {link.label}
      {link.status}
    </Link>
  );
};
