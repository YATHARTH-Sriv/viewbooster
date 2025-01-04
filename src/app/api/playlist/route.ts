import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

interface Video {
  title: string;
  published_at: string;
  video_id: string;
  thumbnail: string;
  view_count: string;
  like_count: string;
  favorite_count: string;
  comment_count: string;
  playlist_id: string;
  // tags: string[]; // Uncomment if you need to store tags
}

interface VideoDataResponse {
  requestedvideodata: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
    publishedAt: string;
    title: string;
    thumbnail: string;
    tags: string[];
  };
}

// Consider moving this to a separate config file
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function POST(request: Request) {
  try {
    const { playlisturl, isGuest } = await request.json();
    console.log("Playlist URL:", playlisturl);
    const session = await getServerSession(authOptions);
    // Add session check
    if (!session?.user?.email) {
      if(!isGuest){
        console.log("Unauthorized request");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
    console.log("Check 1");

    if (!playlisturl) {
      return NextResponse.json({ error: "Playlist URL is required" }, { status: 400 });
    }
    console.log("Check 2");
    const playlistId = playlisturl.split("list=")[1];
    if (!playlistId) {
      return NextResponse.json({ error: "Invalid playlist URL" }, { status: 400 });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const playlistInfoURL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;

    // Use Promise.all for parallel requests
    const [playlistData, playlistInfo] = await Promise.all([
      axios.get(playlistUrl),
      axios.get(playlistInfoURL)
    ]);

    const playlistTitle = playlistInfo.data.items[0]?.snippet?.title;
    if (!playlistTitle) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check existing playlist
    const { data: existingPlaylist, error: playlistFetchError } = await supabase
      .from("playlist")
      .select("*")
      .eq("playlist_id", playlistId)
      .single();

    if (playlistFetchError && playlistFetchError.code !== 'PGRST116') { // Not Found error
      throw new Error(`Failed to check existing playlist: ${playlistFetchError.message}`);
    }

    if (existingPlaylist) {
      const { data: videos, error: videosError } = await supabase
        .from("video_data")
        .select("*")
        .eq("playlist_id", playlistId);

      if (videosError) {
        throw new Error(`Failed to fetch videos: ${videosError.message}`);
      }

      // Update search history and return existing videos
      if(isGuest){
        return NextResponse.json({ videos });
      }
      if (session && session.user && session.user.email) {
        await updateSearchHistory(session.user.email, playlistTitle, playlistId);
      }
      // await updateSearchHistory(session.user.email, playlistTitle, playlistId);
      return NextResponse.json({ videos });
    }

    // Create new playlist
    const { error: playlistError } = await supabase
      .from("playlist")
      .insert({
        playlist_id: playlistId,
        name: playlistTitle,
        total_videos: playlistData.data.pageInfo?.totalResults || 0,
        playlistvideosids: playlistData.data.items.map((item: any) => item.contentDetails.videoId)
      });

    if (playlistError) {
      throw new Error(`Failed to create playlist: ${playlistError.message}`);
    }

    // Process videos in chunks to avoid overwhelming the API
    const chunkSize = 5;
    const videos: Video[] = [];
    
    for (let i = 0; i < playlistData.data.items.length; i += chunkSize) {
      const chunk = playlistData.data.items.slice(i, i + chunkSize);
      const chunkVideos = await Promise.all(
        chunk.map((item:any) => processVideo(item, playlistId))
      );
      videos.push(...chunkVideos.filter((video): video is Video => video !== null));
    }

    // Update search history
    if(isGuest){
      return NextResponse.json({ videos });
    }
    if (session && session.user && session.user.email) {
    await updateSearchHistory(session.user.email, playlistTitle, playlistId);
    }

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error in playlist processing:", error);
    return NextResponse.json(
      { error: "Failed to process playlist", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


async function processVideo(item: any, playlistId: string): Promise<Video | null> {
  try {
    const videoId = item.contentDetails.videoId;
    console.log("Processing video:", videoId);

    const videoDataResponse = await fetch(`https://viewbooster.vercel.app/api/videodata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoid: videoId }),
    });

    if (!videoDataResponse.ok) {
      throw new Error(`Failed to fetch video data: ${videoDataResponse.statusText}`);
    }

    const rawResponse = await videoDataResponse.text();
    console.log("Raw response from videodata API:", rawResponse);

    const videoData: VideoDataResponse = JSON.parse(rawResponse);
    console.log("Parsed videoData:", JSON.stringify(videoData, null, 2));
    
    // Log the specific tags data
    console.log("Tags from response:", videoData.requestedvideodata.tags);

    const videoDetails: Video = {
      video_id: videoId,
      title: item.snippet.title,
      published_at: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.standard?.url || item.snippet.thumbnails.default.url,
      view_count: videoData.requestedvideodata.viewCount || "0",
      like_count: videoData.requestedvideodata.likeCount || "0",
      favorite_count: videoData.requestedvideodata.favoriteCount || "0",
      comment_count: videoData.requestedvideodata.commentCount || "0",
      playlist_id: playlistId,
      // tags: videoData.requestedvideodata.tags || []
    };

    console.log("Final video details:", JSON.stringify(videoDetails, null, 2));

    const { error: videoInsertError } = await supabase
      .from("video_data")
      .insert(videoDetails);

    if (videoInsertError) {
      console.error("Supabase insert error:", videoInsertError);
      throw new Error(`Failed to insert video data: ${videoInsertError.message}`);
    }

    return videoDetails;
  } catch (error) {
    console.error(`Error processing video:`, error);
    return null;
  }
}

async function updateSearchHistory(userEmail: string, playlistTitle: string, playlistId: string) {
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('search_history')
    .eq('email', userEmail)
    .single();

  if (fetchError) {
    console.error('Failed to fetch user data:', fetchError);
    return;
  }

  // Initialize search history if it doesn't exist
  const currentHistory = userData?.search_history || [];
  
  // Check if playlist already exists in history
  const playlistExists = currentHistory.some(
    (search: { playlistid: string }) => search.playlistid === playlistId
  );

  // If playlist already exists, don't add it again
  if (playlistExists) {
    return;
  }

  // Add new playlist to history
  const newHistory = [
    ...currentHistory,
    {
      playlistname: playlistTitle,
      playlistid: playlistId
    }
  ];
  
  const { error: updateError } = await supabase
    .from('users')
    .update({
      search_history: newHistory
    })
    .eq('email', userEmail);

  if (updateError) {
    console.error('Failed to update search history:', updateError);
  }
}
