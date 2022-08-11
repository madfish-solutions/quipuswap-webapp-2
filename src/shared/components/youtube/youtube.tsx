import { FC, useCallback } from 'react';

import YouTubeComp from 'react-youtube';

import { eQuipuSwapVideo, QuipuSwapVideo } from '@config/youtube';
import { amplitudeService } from '@shared/services';

import styles from './youtube.module.scss';

export interface YouTubeProps {
  video: eQuipuSwapVideo;
}

export const YouTube: FC<YouTubeProps> = ({ video }) => {
  const videoInfo = QuipuSwapVideo[video];

  const onPlay = useCallback(() => {
    amplitudeService.logEvent('PLAY_YOUTUBE_VIDEO', { videoInfo });
  }, [videoInfo]);

  return (
    <YouTubeComp
      videoId={videoInfo.videoId}
      className={styles.youtube}
      iframeClassName={styles.youtubeFrame}
      onPlay={onPlay}
    />
  );
};
