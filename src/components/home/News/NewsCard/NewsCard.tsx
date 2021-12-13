import React from 'react';
import Image from 'next/image';

import { isNewsWithLink, News } from '@components/home/News/content';

interface NewsCardProps {
  news: News;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  className,
}) => {
  const ImageComponent = (
    <Image
      layout="fixed"
      width={272}
      height={136}
      src={news.img}
      alt="news"
    />
  );

  return (
    <div className={className}>
      {isNewsWithLink(news) ? (
        <a
          href={news.url}
          target={news.external ? '_blank' : '_self'}
          rel="noreferrer noopener"
        >
          {ImageComponent}
        </a>
      ) : ImageComponent}

    </div>
  );
};
