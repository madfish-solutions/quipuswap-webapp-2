import { FC } from 'react';

import { isNewsWithLink, News } from '../content';

interface NewsCardProps {
  news: News;
  className?: string;
}

export const NewsCard: FC<NewsCardProps> = ({ news, className }) => {
  const ImageComponent = <img width={272} height={136} src={news.img} alt="news" />;

  return (
    <div className={className}>
      {isNewsWithLink(news) ? (
        <a href={news.url} data-cy={news.testId} target={news.external ? '_blank' : '_self'} rel="noreferrer noopener">
          {ImageComponent}
        </a>
      ) : (
        ImageComponent
      )}
    </div>
  );
};
