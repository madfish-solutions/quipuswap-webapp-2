export type YouTubePlayer = {
  addEventListener: (event: string, listener: (...args: unknown[]) => void) => void;
  destroy: () => void;
  getAvailablePlaybackRates: () => Array<number>;
  getAvailableQualityLevels: () => Array<string>;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIframe: () => object;
  getOption: <T>() => T;
  getOptions: <T>() => T;
  setOption: () => void;
  setOptions: () => void;
  cuePlaylist: CuePlaylistF | CuePlaylistS;
  loadPlaylist: LoadPlaylistF | LoadPlaylistS;
  getPlaylist: () => Array<string>;
  getPlaylistIndex: () => number;
  getPlaybackQuality: () => string;
  getPlaybackRate: () => number;
  getPlayerState: () => number;
  getVideoEmbedCode: () => string;
  getVideoLoadedFraction: () => number;
  getVideoUrl: () => string;
  getVolume: () => number;
  cueVideoById: CueVideoByIdF | CueVideoByIdS;
  cueVideoByUrl: CueVideoByUrlF | CueVideoByUrlS;
  loadVideoByUrl: LoadVideoByUrlF | LoadVideoByUrlS;
  loadVideoById: loadVideoByIdF | loadVideoByIdS;
  isMuted: () => boolean;
  mute: () => void;
  nextVideo: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  playVideoAt: (index: number) => void;
  previousVideo: () => void;
  removeEventListener: (event: string, listener: (...args: unknown[]) => void) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setLoop: (loopPlaylists: boolean) => void;
  setPlaybackQuality: (suggestedQuality: string) => void;
  setPlaybackRate: (suggestedRate: number) => void;
  setShuffle: (shufflePlaylist: boolean) => void;
  setSize: (width: number, height: number) => object;
  setVolume: (volume: number) => void;
  stopVideo: () => void;
  unMute: () => void;
};

type CuePlaylistF = (
  playlist: string | Array<string>,
  index?: number,
  startSeconds?: number,
  suggestedQuality?: string
) => void;
type CuePlaylistS = (props: {
  listType: string;
  list?: string;
  index?: number;
  startSeconds?: number;
  suggestedQuality?: string;
}) => void;

type LoadPlaylistF = (
  playlist: string | Array<string>,
  index?: number,
  startSeconds?: number,
  suggestedQuality?: string
) => void;
type LoadPlaylistS = (props: {
  listType: string;
  list?: string;
  index?: number;
  startSeconds?: number;
  suggestedQuality?: string;
}) => void;

type CueVideoByIdF = (videoId: string, startSeconds?: number, suggestedQuality?: string) => void;
type CueVideoByIdS = (props: {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  suggestedQuality?: string;
}) => void;

type CueVideoByUrlF = (mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string) => void;
type CueVideoByUrlS = (props: {
  mediaContentUrl: string;
  startSeconds?: number;
  endSeconds?: number;
  suggestedQuality?: string;
}) => void;

type LoadVideoByUrlF = (mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string) => void;
type LoadVideoByUrlS = (props: {
  mediaContentUrl: string;
  startSeconds?: number;
  endSeconds?: number;
  suggestedQuality?: string;
}) => void;

type loadVideoByIdF = (videoId: string, startSeconds?: number, suggestedQuality?: string) => void;
type loadVideoByIdS = (props: {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  suggestedQuality?: string;
}) => void;
