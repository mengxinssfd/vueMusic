import {playMode} from './config';
import {readFromLocal} from '../common/js/localStore';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  rankInfo: {},
  showPlayerSingerDetail: false, // 用于控制player歌手详情的显示隐藏
  searchHistory: readFromLocal('__searchHistory__', []),
  favoriteList: readFromLocal('__favorite__', []),
  playedList: readFromLocal('__played__', []),
  mvList: []
};
export default state;
