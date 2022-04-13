import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayState } from '../reducers/player.reducer';

const selectPlayerState = (state: PlayState) => state;

export const getPlayer = createFeatureSelector<PlayState>('player');
export const getPlaying = createSelector(selectPlayerState, (state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayerState, (state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayerState, (state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayerState, (state: PlayState) => state.palyMode);
export const getCurrentIndex = createSelector(selectPlayerState, (state: PlayState) => state.currentIndex);

export const getCurrentSong = createSelector(selectPlayerState, ({ playList, currentIndex }: PlayState) => playList[currentIndex]);
