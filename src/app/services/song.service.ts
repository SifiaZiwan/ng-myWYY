import { Lyric, Song, SongUrl } from './data-types/common.types';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_CONFIG, ServicesModule } from './services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    let resp$ = this.http.get(this.uri + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
    return resp$;
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs]; //均转换为数组
    const ids = songArr.map(item => item.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls => this.generateSongList(songArr, urls)));
  }

  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(url => url.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    return result;
  }

  getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    let resp$ = this.http.get(this.uri + 'lyric', { params })
      .pipe(map((res: { [key: string]: { lyric: string; } }) => {
        // return {
        //   lyric: res['lrc'].lyric,
        //   tlyric: res['tlyric'].lyric,
        // }

        try {
          return {
            lyric: res['lrc'].lyric,
            tlyric: res['tlyric'].lyric,
          };
        } catch (err) {
          return {
            lyric: '',
            tlyric: '',
          };
        }
      }));
    return resp$;
  }
}
