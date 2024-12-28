"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Video } from "@/types/datatypes";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleFetch = async () => {
    const response = await axios.post("/api/playlist", { playlisturl });
    setPlaylistvideos(response.data.videos);
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
          <div className="w-12 h-12 relative rounded-full overflow-hidden">
            <Image
              src={session.user.image}
              alt={session?.user?.name || "User"}
              className="object-cover"
              fill
              sizes="48px"
            />
          </div>
        )}
        <h1 className="text-2xl font-semibold ml-4">
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
        <div className="mx-auto max-w-7xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {playlistvideos.map((video, index) => (
                <CarouselItem 
                  key={video.videoId} 
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card 
                      className="border-gray-700 bg-gray-800 hover:bg-gray-700 cursor-pointer transition"
                      onClick={() => handleVideoClick(video.videoId)}
                    >
                      <CardContent className="p-4">
                        <div className="relative w-full pt-[56.25%] mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold line-clamp-2 text-white">
                            {video.title}
                          </h2>
                          <p className="text-sm text-gray-400">
                            {new Date(video.publishedAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>{Number(video.views).toLocaleString()} views</span>
                            {video.likeCount && (
                              <span>{Number(video.likeCount).toLocaleString()} likes</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
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