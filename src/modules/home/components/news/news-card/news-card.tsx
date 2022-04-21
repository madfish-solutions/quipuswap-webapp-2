import { FC } from 'react';

import { amplitudeService } from '@shared/services';

import { isNewsWithLink, News } from '../content';

interface NewsCardProps {
  news: News;
  className?: string;
}

export const NewsCard: FC<NewsCardProps> = ({ news, className }) => {
  const ImageComponent = <img width={272} height={136} src={news.img} alt="news" />;

  const handleNewsClick = (url: string) => {
    amplitudeService.logEvent('HOME_NEWS_CLICK', { url });
  };

  return (
    <div className={className}>
      {isNewsWithLink(news) ? (
        <a
          href={news.url}
          target={news.external ? '_blank' : '_self'}
          rel="noreferrer noopener"
          onClick={() => handleNewsClick(news.url)}
        >
          {ImageComponent}
        </a>
      ) : (
        ImageComponent
      )}
    </div>
  );
};
