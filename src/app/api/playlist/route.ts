import { NextResponse } from "next/server";
import axios from "axios";

interface Video {
  title: string;
  publishedAt: string;
  videoId: string;
  thumbnail: string;
  views: number;
  likeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
}

export async function POST(request: Request) {
  const { playlisturl } = await request.json();

  if (!playlisturl) {
    return NextResponse.json({ error: "Playlist URL is required" }, { status: 400 });
  }

  const playlistId = playlisturl.split("list=")[1];
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

  try {
    const { data } = await axios.get(playlistUrl);

    // Extract video details including thumbnails
    const videoDetailsRequests = data.items.map(async (item: any) => {
      const videoId = item.contentDetails.videoId;
      
      // Call the videodata API to get additional details like viewCount, likeCount, etc.
      const videoDataResponse = await fetch(`https://viewbooster.vercel.app/api/videodata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoid: videoId }),
      });

      const videoData = await videoDataResponse.json();

      return {
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        videoId: videoId,
        thumbnail: item.snippet.thumbnails.standard.url,
        views: videoData.requestedvideodata?.viewCount,
        likeCount: videoData.requestedvideodata?.likeCount,
        favoriteCount: videoData.requestedvideodata?.favoriteCount,
        commentCount: videoData.requestedvideodata?.commentCount,
      };
    });

    // Wait for all video details requests to complete
    const videos: Video[] = await Promise.all(videoDetailsRequests);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist data" },
      { status: 500 }
    );
  }
}
