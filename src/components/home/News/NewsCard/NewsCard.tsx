import React, { useContext } from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { prepareTokenLogo } from '@utils/helpers';
import { Bage } from '@components/ui/Bage';
import { FallbackLogo } from '@components/svg/FallbackLogo';

import s from './NewsCard.module.sass';

type NewsCardProps = {
  img?: string,
  sponsored?: boolean
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NewsCard: React.FC<NewsCardProps> = ({
  sponsored = false,
  img = '',
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const prepimg = prepareTokenLogo(img);

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      {sponsored && <Bage text="sponsored" className={s.sponsored} />}
      {prepimg ? (
        <Image
          layout="fixed"
          width={272}
          height={136}
          src={prepimg}
          alt="news"
          className={cx(s.image)}
        />
      ) : (
        <FallbackLogo className={cx(s.image)} />
      )}
    </div>
  );
};
