import React, { useContext, useEffect } from 'react';
import cx from 'classnames';
import { NextSeo } from 'next-seo';

import { DEFAULT_SEO } from '@utils/default-seo.config';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { NotFoundHeader } from '@components/common/NotFoundHeader';
import { NotFoundBackground } from '@components/svg/NotFoundBackground';

import s from './NotFoundLayout.module.sass';

interface NotFoundLayoutProps {
  title?: string,
  description?: string,
  image?: string,
  className?: string;
}

export const NotFoundLayout: React.FC<NotFoundLayoutProps> = ({
  title,
  description,
  image,
  className,
  children,
}) => {
  const { colorThemeMode, isComponentDidMount } = useContext(ColorThemeContext);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Dark) {
      document.querySelector('body')?.classList.add(ColorModes.Dark);
    } else {
      document.querySelector('body')?.classList.remove(ColorModes.Dark);
    }
  }, [colorThemeMode]);

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: image!! ? [
            {
              url: `${DEFAULT_SEO.WEBSITE_URL}${image}`,
              width: 1200,
              height: 627,
              alt: DEFAULT_SEO.TITLE,
            },
          ] : [],
        }}
        additionalMetaTags={image!! ? [{
          property: 'image',
          content: `${DEFAULT_SEO.WEBSITE_URL}${image}`,
        }] : []}
      />
      {isComponentDidMount ? (
        <div className={s.root}>
          <NotFoundHeader />
          <NotFoundBackground className={s.background} />
          {/* <NotFoundBackground className={s.background} /> */}
          <main className={cx(s.wrapper, className)}>
            {children}
          </main>
        </div>
      ) : <div />}
    </>
  );
};
