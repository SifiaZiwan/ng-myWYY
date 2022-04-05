import { PlayMode } from './../../share/wy-ui/wy-player/player-types';
import { createSelector } from '@ngrx/store';
import { PlayState } from './../reducers/playder.reducer';

const selectPlayerState = (state: PlayState) => state;

export const getPlaying = createSelector(selectPlayerState, (state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayerState, (state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayerState, (state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayerState, (state: PlayState) => state.palyMode);
export const getCurrentIndex = createSelector(selectPlayerState, (state: PlayState) => state.currentIndex);

export const getCurrentSong = createSelector(selectPlayerState, ({ playList, currentIndex }: PlayState) => playList[currentIndex]);
