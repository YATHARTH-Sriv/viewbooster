import { NextResponse } from "next/server";
import axios from "axios";

interface videodata{
  viewCount?: string,
  likeCount?: string,
  favoriteCount?: string,
  commentCount?: string,
  publishedAt?: string,
  title?: string,
  thumbnail?: string,
}

export async function POST(request: Request) {
  const { videoid } = await request.json();

  if (!videoid) {
    return NextResponse.json({ error: "Playlist Id is required" }, { status: 400 });
  }
  const apiKey = process.env.YOUTUBE_API_KEY;
  const videourl=`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoid}&key=${apiKey}`;

  try {
    const { data: videoData } = await axios.get(videourl);
    const requestedvideodata:videodata={
      viewCount: videoData.items[0].statistics.viewCount,
      likeCount: videoData.items[0].statistics.likeCount,
      favoriteCount: videoData.items[0].statistics.favoriteCount,
      commentCount: videoData.items[0].statistics.commentCount,
      publishedAt: videoData.items[0].snippet.publishedAt,
      title: videoData.items[0].snippet.title,
      thumbnail: videoData.items[0].snippet.thumbnails.medium.url,
    }
    return NextResponse.json({ requestedvideodata });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch playlist data" }, { status: 500 });
  }
}
