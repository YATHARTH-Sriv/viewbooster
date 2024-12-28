"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Video } from "@/types/datatypes";
import { Card } from "@/components/ui/card";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Chart } from "@/components/graph";
import VideoPopup from "@/components/videopopup";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/Login");
    }
  }, [session, router]);

  const [playlisturl, setPlaylisturl] = useState("");
  const [playlistvideos, setPlaylistvideos] = useState<Video[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleFetch = async () => {
    const response = await axios.post("/api/playlist", { playlisturl });
    setPlaylistvideos(response.data.videos);
  };

  const handleNext = () => {
    if (visibleIndex + 4 < playlistvideos.length) {
      setVisibleIndex(visibleIndex + 4);
    }
  };

  const handlePrevious = () => {
    if (visibleIndex - 4 >= 0) {
      setVisibleIndex(visibleIndex - 4);
    }
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const chartData = playlistvideos.map((video) => ({
    name: video.title,
    views: Number(video.views),
    date: video.publishedAt,
    likes: video.likeCount ? Number(video.likeCount) : 0,
    comments: video.commentCount ? Number(video.commentCount) : 0,
  }));

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6">
      {/* Welcome Message */}
      <div className="flex items-center mb-6">
        {session && session.user.image && (
          <Image
            src={session.user.image}
            alt={session?.user?.name}
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <h1 className="text-2xl font-semibold">
          Welcome, {session?.user?.name}
        </h1>
        <Button
          variant="outline"
          className="ml-auto h-10 px-4 text-black bg-white hover:text-white hover:bg-black border-white"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">YouTube Dashboard</h1>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Enter Playlist Link"
          value={playlisturl}
          onChange={(e) => setPlaylisturl(e.target.value)}
          className="p-3 rounded-lg border border-gray-700 bg-black text-white w-64 placeholder-gray-500"
        />
        <button
          onClick={handleFetch}
          className="ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Fetch Stats
        </button>
      </div>

      {playlistvideos.length > 0 && (
        <Card className="bg-gray-900 p-4">
          <div className="relative">
            <div className="flex overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{
                  transform: `translateX(-${visibleIndex * 25}%)`,
                  width: `${(playlistvideos.length / 4) * 100}%`,
                }}
              >
                {playlistvideos.map((video) => (
                  <div
                    key={video.videoId}
                    className="flex-shrink-0 w-1/4 p-2"
                    style={{ minWidth: "25%" }}
                  >
                    <div
                      className="p-4 border border-gray-700 rounded-lg bg-white hover:bg-gray-700 cursor-pointer transition"
                      onClick={() => handleVideoClick(video.videoId)}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        className="mb-4 rounded-lg"
                      />
                      <h2 className="text-lg font-semibold">{video.title}</h2>
                      <p className="text-sm text-gray-400">{video.publishedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handlePrevious}
                className={`mx-2 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 ${
                  visibleIndex <= 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={visibleIndex <= 0}
              >
                <MdNavigateBefore className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className={`mx-2 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 ${
                  visibleIndex + 4 >= playlistvideos.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={visibleIndex + 4 >= playlistvideos.length}
              >
                <MdNavigateNext className="h-6 w-6" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {playlistvideos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-center">
            Playlist Stats Chart
          </h2>
          <Chart data={chartData} />
        </div>
      )}

      {selectedVideoId && (
        <VideoPopup
          videoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </div>
  );
}

export default Page;
