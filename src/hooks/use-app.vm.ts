import { useEffect } from 'react';

import { ColorModes } from '@quipuswap/ui-kit';
import { useRouter } from 'next/router';

import { DEFAULT_SEO } from '@seo.config';
import { debounce, isClient } from '@utils/helpers';

const RESIZE_DEBOUNCE = 1000; // 1 sec
const HEIGHT_KOEF = 0.01;
const HEIGHT_EMPTY = 0;

export const useAppViewModel = () => {
  const router = useRouter();

  if (isClient && localStorage.getItem('theme') === ColorModes.Dark) {
    document.querySelector('body')?.classList.add('dark');
  }

  useEffect(() => {
    // prevents flashing
    const debouncedHandleResize = debounce(() => {
      const vh = window.innerHeight * HEIGHT_KOEF;
      if (vh !== HEIGHT_EMPTY) {
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    }, RESIZE_DEBOUNCE);
    debouncedHandleResize();

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  const title = undefined;
  const description = DEFAULT_SEO.DESCRIPTION;
  const titleTemplate = `${DEFAULT_SEO.TITLE}`;
  const defaultTitle = DEFAULT_SEO.TITLE;

  const openGraph = {
    type: DEFAULT_SEO.OG.TYPE,
    locale: router.locale || 'en_US',
    url: DEFAULT_SEO.WEBSITE_URL,
    site_name: DEFAULT_SEO.OG.SITE_NAME,
    title: DEFAULT_SEO.TITLE,
    description,
    images: [
      {
        url: `${DEFAULT_SEO.WEBSITE_URL}${DEFAULT_SEO.IMAGE}`,
        width: 1200,
        height: 627,
        alt: DEFAULT_SEO.TITLE
      }
    ]
  };

  const twitter = {
    handle: DEFAULT_SEO.TWITTER.HANDLE,
    site: DEFAULT_SEO.TWITTER.SITE,
    cardType: DEFAULT_SEO.TWITTER.CARD_TYPE
  };

  const additionalMetaTags = [
    {
      property: 'image',
      content: `${DEFAULT_SEO.WEBSITE_URL}${DEFAULT_SEO.IMAGE}`
    }
  ];

  return { title, description, titleTemplate, defaultTitle, openGraph, twitter, additionalMetaTags };
};
