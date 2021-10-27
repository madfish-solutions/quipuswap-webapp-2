import React, { useContext } from 'react';
import Image from 'next/image';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Bage } from '@components/ui/Bage';

import { Button } from '@components/ui/Button';
import s from './NewsCard.module.sass';

type NewsCardProps = {
  img?: string,
  sponsored?: boolean
  className?: string
  link: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NewsCard: React.FC<NewsCardProps> = ({
  sponsored = false,
  img = '',
  className,
  link,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const prepimg = img;

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      {sponsored && <Bage text="sponsored" className={s.sponsored} />}
      {prepimg && img ? (
        <Button theme="quaternary" external href={link}>
          <Image
            layout="fixed"
            width={272}
            height={136}
            src={prepimg}
            alt="news"
            className={cx(s.image)}
          />
        </Button>
      ) : (
        <div className={s.disabled}>
          <div className={s.disabledBg} />
          <h2 className={s.h1}>{t('common|Coming soon!')}</h2>
        </div>
      )}
    </div>
  );
};
