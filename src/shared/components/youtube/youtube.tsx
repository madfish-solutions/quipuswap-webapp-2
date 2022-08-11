import { FC } from 'react';

import YouTubeComp from 'react-youtube';

import { QuipuSwapVideo } from '@config/constants';

import styles from './youtube.module.scss';

export interface YouTubeProps {
  videoId: QuipuSwapVideo;
}

export const YouTube: FC<YouTubeProps> = ({ videoId }) => {
  return <YouTubeComp videoId={videoId} className={styles.youtube} iframeClassName={styles.youtubeFrame} />;
};
