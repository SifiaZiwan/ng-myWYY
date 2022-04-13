import { Action, createReducer, on } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex } from '../actions/player.actions';
import { Song } from '../../services/data-types/common.types';
import { PlayMode } from '../../share/wy-ui/wy-player/player-types';

export interface PlayState {
  playing: boolean; // play status
  palyMode: PlayMode; // play mode
  songList: Song[]; // song list
  playList: Song[];
  currentIndex: number;
}

//初始数据
export const initialState: PlayState = {
  playing: false, // play status
  songList: [], // song list
  playList: [],
  palyMode: { type: 'loop', label: '循环' },// play mode
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