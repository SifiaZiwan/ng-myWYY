export interface Banner {
  targetId: number;
  url: string;
  imageUrl: string;
}

export interface HotTag {
  id: number;
  name: string;
  position: number;
}

//歌手
export interface Singer {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}

//歌曲
export interface Song {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: NumberConstructor; name: string; picUrl: string };
  dt: number;
}

//播放地址
export interface SongUrl {
  id: number;
  url: string;
}

//歌单
export interface SongSheet {
  id: number;
  name: string;
  playCount: number;
  picUrl: string;
  track: Song[];
}
