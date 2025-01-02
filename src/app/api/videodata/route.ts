import { NextResponse } from "next/server";
import axios from "axios";

interface VideoData {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
  publishedAt: string;
  title: string;
  thumbnail: string;
  // tags: string[];
}

interface YouTubeApiResponse {
  items: Array<{
    statistics: {
      viewCount: string;
      likeCount: string;
      favoriteCount: string;
      commentCount: string;
    };
    snippet: {
      publishedAt: string;
      title: string;
      thumbnails: {
        standard?: {
          url: string;
        };
        default: {
          url: string;
        };
      };
      // tags?: string[];
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const { videoid } = await request.json();
    console.log("Processing video ID:", videoid);

    if (!videoid) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoid}&key=${apiKey}`;

    console.log("Fetching from YouTube API...");
    const { data } = await axios.get<YouTubeApiResponse>(videoUrl);
    console.log("Raw YouTube API response:", JSON.stringify(data, null, 2));

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const videoItem = data.items[0];
    // console.log("Video tags from YouTube:", videoItem.snippet.tags);

    const requestedvideodata: VideoData = {
      viewCount: videoItem.statistics.viewCount || "0",
      likeCount: videoItem.statistics.likeCount || "0",
      favoriteCount: videoItem.statistics.favoriteCount || "0",
      commentCount: videoItem.statistics.commentCount || "0",
      publishedAt: videoItem.snippet.publishedAt,
      title: videoItem.snippet.title,
      thumbnail: videoItem.snippet.thumbnails.standard?.url || 
                videoItem.snippet.thumbnails.default.url,
      // tags: videoItem.snippet.tags || []
    };

    console.log("Processed video data:", JSON.stringify(requestedvideodata, null, 2));
    return NextResponse.json({ requestedvideodata });
  } catch (error) {
    console.error("Error fetching video data:", error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return NextResponse.json({ error: "API key error or quota exceeded" }, { status: 403 });
      }
      if (error.response?.status === 404) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: "Failed to fetch video data" }, { status: 500 });
  }
}