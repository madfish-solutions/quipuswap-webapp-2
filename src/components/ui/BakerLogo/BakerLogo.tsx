import React from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { prepareTokenLogo, getWhitelistedBakerName } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';
import { Baker } from '@components/svg/Baker';

import s from './BakerLogo.module.sass';

export interface BakerLogoInterface {
  baker: WhitelistedBaker
  className?: string
}

export const BakerLogo: React.FC<BakerLogoInterface> = ({
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
          alt={getWhitelistedBakerName(prepareBaker)}
          className={s.image}
        />
      ) : (
        <Baker className={s.image} />
      )}
    </div>
  );
};
