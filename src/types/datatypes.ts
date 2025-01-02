

// export interface Video {
//     title: string;
//     publishedAt: string;
//     videoId: string;
//     thumbnail: string;
//     views: number;
//     likeCount?: string;
//     favoriteCount?: string;
//     commentCount?: string;
//   }

export interface Video {
  id: number,
  video_id: string,
  view_count: number,
  like_count: number,
  favorite_count: number,
  comment_count: number,
  published_at: string,
  title: string,
  thumbnail: string,
  tags: null,
  playlist_id: string
}

export interface videodata{
    viewCount?: string,
    likeCount?: string,
    favoriteCount?: string,
    commentCount?: string,
    publishedAt?: string,
    title?: string,
    thumbnail?: string,
  }

export interface search{
  playlistname: string,
  playlistid: string
}

export interface userData{
  id: number,
  google_id: string,  
  name: string,
  email: string,
  image: string,
  created_at: string,
  updated_at: string,
  search_history: Array<search>
}