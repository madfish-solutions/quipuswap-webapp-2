/* eslint-disable no-console */
import { useCallback, useRef } from 'react';

import YouTubeComp, { YouTubeEvent } from 'react-youtube';

import { Play } from './play';
import { YouTubePlayer } from './types';
import styles from './youtube.module.scss';

const videoId = 'bEulMMvSqBc';

export const YouTube = () => {
  const youTubePlayer = useRef<Nullable<YouTubePlayer>>(null);

  const onReady = useCallback(
    (event: YouTubeEvent) => {
      // eslint-disable-next-line no-console
      console.log(event.target, youTubePlayer);
      youTubePlayer.current = event.target;
      event.target.pauseVideo();

      // setTimeout(() => {
      //   console.log(youTubePlayer.current);
      //   youTubePlayer.current?.playVideo();
      // }, 3000);
    },
    [youTubePlayer]
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.wrapInner}>
        <Play className={styles.play} />
        <img className={styles.preview} src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" />
        <YouTubeComp videoId={videoId} className={styles.youtubeFrame} onReady={onReady} />
      </div>
      <YouTubeComp
        videoId={videoId}
        className={styles.youtube}
        iframeClassName={styles.youtubeFrame}
        onReady={onReady}
      />
    </div>
  );
};
