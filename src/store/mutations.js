import * as types from './mutation-type';
import {playMode} from './config';
import {shuffle} from '../common/js/util';
// import {getVkey} from '../api/song';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING](state, playing) {
    if (playing === undefined) {
      state.playing = !state.playing;
    } else {
      state.playing = playing;
    }
  },
  [types.SET_FULLSCREEN](state, fullScreen) {
    if (fullScreen === undefined) {
      state.fullScreen = !state.fullScreen;
    } else {
      state.fullScreen = fullScreen;
    }
  },
  [types.SET_PLAYLIST](state, list) {
    // 移动到action
    /* if (state.sequenceList !== list) {
       // 点击不同的列表的歌曲
       state.sequenceList = list;
       state.playList = list;
       // console.log(this); // this === store
       // 重新赋值，把应该是随机播放的顺序播放变为随机播放
       this.commit(types.SET_MODE, state.mode);
     } else {
       // 点击相同的列表的歌曲
       console.log('same list;select other song');
       // 已经点过的歌曲列表，再点击一次切换歌曲
       let selectSong = state.sequenceList[state.currentIndex];
       state.currentIndex = state.playList.indexOf(selectSong);
     } */
    state.playList = list;
  },
  [types.PLAYLIST_PUSH](state, list) {
    state.sequenceList = state.sequenceList.concat(list);
    if (state.mode === playMode.random) {
      state.playList = state.playList.concat(shuffle(list));
    } else {
      state.playList = state.playList.concat(list);
    }
  },
  [types.SET_SEQUENCELIST](state, sequenceList) {
    state.sequenceList = sequenceList;
  },
  [types.SET_MODE](state, mode) {
    if (mode !== undefined) {
      state.mode = mode;
    } else {
      state.mode = (state.mode + 1) % Object.keys(playMode).length;
    }
    if (state.mode === playMode.random) {
      state.playList = shuffle(state.playList, state.currentIndex);
      state.currentIndex = 0;
    } else {
      if (state.playList === state.sequenceList) return;

      // 从随机播放改为顺序播放
      let currentSong = state.playList[state.currentIndex];
      state.currentIndex = state.sequenceList.indexOf(currentSong);
      state.playList = state.sequenceList;
    }
  },
  [types.SET_CURRENTINDEX](state, currentIndex) {
    state.currentIndex = currentIndex;
  },
  [types.SET_SONGURL](state, {song, url}) {
    song.url = url;
  },
  [types.SET_NEXTSONG](state) {
    let len = state.playList.length;
    if (state.currentIndex === len - 1) {
      state.currentIndex = 0;
    } else {
      state.currentIndex++;
    }
  },
  [types.SET_PREVSONG](state) {
    let len = state.playList.length;
    if (state.currentIndex === 0) {
      state.currentIndex = len - 1;
    } else {
      state.currentIndex--;
    }
  },
  [types.SET_SONGLYRIC](state, {song, lyric}) {
    song.lyric = lyric;
  },
  [types.SET_RANKINFO](state, rankInfo) {
    state.rankInfo = rankInfo;
  },
  [types.SET_SHOW_PLAYER_SINGER_DETAIL](state, flag) {
    state.showPlayerSingerDetail = flag;
  },
  [types.PLAYLIST_INSERT](state, {index, insert}) {
    state.playList.splice(index, 0, insert);
  },
  [types.SET_SEARCH_HISTORY](state, list) {
    state.searchHistory = list;
  },
  [types.SEARCH_HISTORY_PUSH](state, item) {
    state.searchHistory.unshift(item);
  },
  [types.SET_PLAYEDLIST](state, list) {
    state.playedList = list;
  },
  [types.SET_FAVORITELIST](state, list) {
    state.favoriteList = list;
  },
  [types.SET_MVLIST](state, list) {
    state.mvList = list;
  }
};
export default mutations;
