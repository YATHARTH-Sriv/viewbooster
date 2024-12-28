

export interface Video {
    title: string;
    publishedAt: string;
    videoId: string;
    thumbnail: string;
    views: number;
    likeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
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