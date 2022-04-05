import { Action, createReducer, on } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex } from './../actions/player.actions';
import { Song } from './../../services/data-types/common.types';
import { PlayMode } from './../../share/wy-ui/wy-player/player-types';

export type PlayState = {
  playing: boolean; // play status
  palyMode: PlayMode; // play mode
  songList: Song[]; // song list
  playList: Song[];
  currentIndex: number;
}

//初始数据
export const initialState: PlayState = {
  playing: false, // play status
  palyMode: { type: 'loop', label: '循环' },// play mode
  songList: [], // song list
  playList: [],
  currentIndex: -1,
}

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetSongList, (state, { songList }) => ({ ...state, songList })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex }))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}


// export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean }>());
// export const SetPlayList = createAction('[player] Set playList', props<{ playList: Song[] }>());
// export const SetSongList = createAction('[player] Set songList', props<{ songList: Song[] }>());
// export const SetPlayMode = createAction('[player] Set playMode', props<{ playMode: PlayMode }>());
// export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ currentIndex: number }>());