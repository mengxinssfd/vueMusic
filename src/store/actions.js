import * as types from './mutation-type';
import {getVkey, getLrc} from '../api/song';
import {ERR_OK} from '../api/config';
import {Base64, insertToArray} from '../common/js/util';
import {saveToLocal} from '../common/js/localStore';

export const selectSongs = function (context, {songs, index}) {
  context.commit(types.SET_CURRENTINDEX, index);
  let state = context.state;
  if (state.sequenceList !== songs) {
    // 点击不同的列表的歌曲
    context.commit(types.SET_SEQUENCELIST, songs);
    context.commit(types.SET_PLAYLIST, songs);
    // 重新赋值，把应该是随机播放的顺序播放变为随机播放
    this.commit(types.SET_MODE, state.mode); // 必须先提交index，否则当前列表切换到另一个列表时会歌曲错误
  } else {
    // 点击相同的列表的歌曲
    console.log('same list;select other song');
    // 已经点过的歌曲列表，再点击一次切换歌曲,把currentIndex换为在playList中的index
    let selectSong = state.sequenceList[index];
    index = state.playList.indexOf(selectSong);
    context.commit(types.SET_CURRENTINDEX, index);
  }
  context.commit(types.SET_PLAYING, true);

  // 原action
  /* context.commit(types.SET_CURRENTINDEX, index);
  context.commit(types.SET_PLAYLIST, songs);
  // context.commit(types.SET_FULLSCREEN);
  context.commit(types.SET_PLAYING, true); */
};
export const songUrlAddVkey = function (context, song) {
  // console.log(context.state.fullScreen);
  getVkey(song.mid).then((res) => {
    let url = '';
    if (res.code === ERR_OK) {
      let vkey = res.data.items[0].vkey;
      if (vkey) {
        url = 'http://dl.stream.qqmusic.qq.com/C400' + song.mid + '.m4a' + '?vkey=' + vkey + '&guid=4714956536&fromtag=66';
      } else {
        url = song.secondUrl;
      }
    } else {
      url = song.secondUrl;
    }
    context.commit(types.SET_SONGURL, {song, url});
  });
};
export const nextSong = function (context) {
  context.commit(types.SET_NEXTSONG);
};
export const prevSong = function (context) {
  context.commit(types.SET_PREVSONG);
};
// 添加歌词
export const songAddLyric = function (context, {song, handler}) {
  getLrc(song.mid).then((res) => {
    let lyric = '';
    if (res.code === ERR_OK) {
      lyric = new Base64().decode(res.lyric);
    } else {
      lyric = '这首歌曲没有歌词,请您欣赏';
    }
    handler(lyric);
    context.commit(types.SET_SONGLYRIC, {song, lyric});
  });
};
export const addHistory = function (context, history) {
  let key = '__searchHistory__';
  let hisList = context.state.searchHistory;
  let {list: newList} = insertToArray(hisList, history, 0, null, 20);
  context.commit(types.SET_SEARCH_HISTORY, newList);
  saveToLocal(key, newList);
};
export const clearHistory = function (context) {
  let key = '__searchHistory__';
  context.commit(types.SET_SEARCH_HISTORY, []);
  saveToLocal(key, []);
};
export const updateHistory = function (context, history) {
  let key = '__searchHistory__';
  let hisList = context.state.searchHistory.slice();
  let index = hisList.indexOf(history);
  hisList.splice(index, 1);
  context.commit(types.SET_SEARCH_HISTORY, hisList);
  saveToLocal(key, hisList);
};

export const songListDeleteOne = function (context, song) {
  let state = context.state;

  // 从原始列表中删除歌曲
  let sList = state.sequenceList.slice();
  let indexInSList = sList.indexOf(song);
  sList.splice(indexInSList, 1);
  context.commit(types.SET_SEQUENCELIST, sList);

  // 从播放列表中删除歌曲
  let pList = state.playList.slice();
  let indexInPList = pList.indexOf(song);
  pList.splice(indexInPList, 1);
  // 如果要删除的index小于当前歌曲的index，则当前歌曲的index要-1，否则不变
  if (indexInPList < state.currentIndex) {
    context.commit(types.SET_CURRENTINDEX, state.currentIndex - 1);
  }
  context.commit(types.SET_PLAYLIST, pList);
};

export const clearSongList = function (context) {
  context.commit(types.SET_SEQUENCELIST, []);
  context.commit(types.SET_PLAYLIST, []);
  context.commit(types.SET_PLAYING, false);
};

export const favoriteAddOne = function ({state, commit}, favoriteSong) {
  let key = '__favorite__';
  favoriteSong = Object.assign({}, favoriteSong);
  favoriteSong.lyric = '';
  let list = state.favoriteList.slice();
  let {list: newList} = insertToArray(list, favoriteSong, 0, (item) => {
    return item.id === favoriteSong.id;
  }, 200);
  commit(types.SET_FAVORITELIST, newList);
  saveToLocal(key, newList);
};
export const favoriteDeleteOne = function ({state, commit}, favoriteSong) {
  let key = '__favorite__';
  let list = state.favoriteList.slice();
  let index = list.findIndex((item) => {
    return item.id === favoriteSong.id;
  });
  list.splice(index, 1);
  commit(types.SET_FAVORITELIST, list);
  saveToLocal(key, list);
};
export const playedAddOne = function ({state, commit}, song) {
  let key = '__played__';
  song = Object.assign({}, song);
  song.lyric = '';
  let list = state.playedList.slice();
  let {list: newList} = insertToArray(list, song, 0, (item) => {
    return item.id === song.id;
  }, 200);
  commit(types.SET_PLAYEDLIST, newList);
  saveToLocal(key, newList);
};
export const playedDeleteOne = function ({state, commit}, song) {
  let key = '__played__';
  let list = state.playedList.slice();
  let index = list.findIndex((item) => {
    return item.id === song.id;
  });
  list.splice(index, 1);
  commit(types.SET_PLAYEDLIST, list);
  saveToLocal(key, list);
};
