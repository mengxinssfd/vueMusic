// import {getVkey} from '../api/song';

export const singer = state => state.singer;
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playList = state => state.playList;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
export const currentSong = (state) => {
  let song = state.playList[state.currentIndex];
  /* if (!song.url) {
    getVkey(song.mid).then((res) => {
      song.url = 'http://dl.stream.qqmusic.qq.com/C400' + song.mid + '.m4a' + '?vkey=' + res.data.items[0].vkey + '&guid=4714956536&fromtag=66';
    });
  } */
  // console.log(song);
  return song || {};
};
export const rankInfo = (state) => state.rankInfo;
export const showPlayerSingerDetail = (state) => state.showPlayerSingerDetail;
export const searchHistory = (state) => state.searchHistory;
export const favoriteList = (state) => state.favoriteList;
export const playedList = (state) => state.playedList;
export const mvList = (state) => state.mvList;
