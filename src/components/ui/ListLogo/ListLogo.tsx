import React from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { prepareTokenLogo } from '@utils/helpers';
import { WhitelistedTokenList } from '@utils/types';
import { FallbackLogo } from '@components/svg/FallbackLogo';

import s from './ListLogo.module.sass';

export interface ListLogoInterface {
  list: WhitelistedTokenList
  width?:number
  className?: string
  imageClassName?: string
  layout?: 'fixed' | 'fill'
}

export const ListLogo: React.FC<ListLogoInterface> = ({
  list,
  width = 24,
  className,
  imageClassName,
  layout = 'fixed',
}) => {
  const compoundClassName = cx(
    s.root,
    className,
  );

  const prepareList = list && {
    ...list,
    icon: prepareTokenLogo(list.logoURI),
  };
  return (
    <div className={compoundClassName}>
      <div className={cx(s.imageWrapper, imageClassName)}>
        {prepareList.icon ? (
          <Image
            {...layout === 'fill' ? { layout } : { layout, width, height: width }}
            src={prepareList.icon}
            alt={list.name}
            className={s.image}
          />
        ) : (
          <FallbackLogo className={s.image} />
        )}
      </div>
    </div>
  );
};
