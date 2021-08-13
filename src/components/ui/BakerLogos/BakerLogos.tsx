import React from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { prepareTokenLogo } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';
import FallbackLogo from '@icons/FallbackLogo.svg';

import s from './BakerLogos.module.sass';

export interface BakerLogosInterface {
  baker: WhitelistedBaker
  className?: string
}

export const BakerLogos: React.FC<BakerLogosInterface> = ({
  baker,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    className,
  );

  const prepareBaker = baker && {
    ...baker,
    icon: prepareTokenLogo(baker.logo),
  };

  return (
    <div className={compoundClassName}>
      {prepareBaker.icon ? (
        <Image
          layout="fixed"
          width={24}
          height={24}
          src={prepareBaker.icon}
          alt=""
          className={cx(s.image)}
        />
      ) : (
        <FallbackLogo className={cx(s.image)} />
      )}
    </div>
  );
};
