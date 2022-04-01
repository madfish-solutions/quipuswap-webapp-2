import { FC } from 'react';

import cx from 'classnames';

import { Baker } from '@shared/svg';

import s from './baker-logo.module.scss';

export interface BakerLogoProps {
  bakerName: string;
  className?: string;
  bakerIcon?: string;
}

export const BakerLogo: FC<BakerLogoProps> = ({ bakerIcon, bakerName, className }) => {
  const compoundClassName = cx(s.root, className);

  return (
    <div className={compoundClassName}>
      {bakerIcon ? (
        <img width={24} height={24} src={bakerIcon} alt={bakerName} className={cx(s.image)} />
      ) : (
        <Baker className={cx(s.image)} />
      )}
    </div>
  );
};
