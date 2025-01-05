"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import VideoPopup from "@/components/videopopup";
import VideoAnalytics from "@/components/Analytics";
import Chart from "@/components/Chart";
import Settings from "@/components/Settings";
import { search } from "@/types/datatypes";

// Types
interface Video {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  view_count: string;
  like_count?: string;
  comment_count?: string;
}

interface UserData {
  id: number;
  google_id: string;
  email: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  search_history?: search[];
}

interface ChartData {
  name: string;
  views: number;
  date: string;
  likes: number;
  comments: number;
}

// Loading Component
const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-[200px] w-full bg-gray-800" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[300px] w-full bg-gray-800" />
      ))}
    </div>
    <Skeleton className="h-[400px] w-full bg-gray-800" />
  </div>
);

// Error Component
const ErrorAlert = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

function Dashboard() {
  // States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeComponent, setActiveComponent] = useState<string>("home");
  const [playlisturl, setPlaylisturl] = useState("");
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Hooks
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (session?.user?.isGuest) {
          // Set default data for guest users
          setUserData({
            id: 0,
            google_id: "",
            email: "",
            name: "Guest User",
            image: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            search_history: []
          });
        } else if (session) {
          // Fetch data for authenticated users
          const response = await axios.get("/api/userdata");
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  // Handle playlist fetch
  const handleFetchPlaylist = async () => {
    if (!playlisturl.trim()) {
      setError("Please enter a valid playlist URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/playlist", {
        playlisturl,
        isGuest: session?.user?.isGuest
      });
      setPlaylistVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setError("Failed to fetch playlist data. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  // Transform data for chart
  const chartData: ChartData[] = playlistVideos.map((video) => ({
    name: video.title,
    views: Number(video.view_count),
    date: video.published_at,
    likes: video.like_count ? Number(video.like_count) : 0,
    comments: video.comment_count ? Number(video.comment_count) : 0,
  }));

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
        // isGuest={session?.user?.isGuest}
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } p-6`}
      >
        {activeComponent === "home" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">YouTube Dashboard</h1>
              {session?.user?.isGuest && (
                <Alert className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You're in guest mode. Some features may be limited.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {error && <ErrorAlert message={error} />}

            {/* Search Input */}
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Enter YouTube Playlist URL"
                value={playlisturl}
                onChange={(e) => setPlaylisturl(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleFetchPlaylist}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Fetch Playlist"}
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingState />}

            {/* Playlist Content */}
            {!isLoading && playlistVideos.length > 0 && (
              <div className="space-y-8">
                {/* Video Carousel */}
                <div className="relative px-4 md:px-8 lg:px-12">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {playlistVideos.map((video) => (
                        <CarouselItem
                          key={video.video_id}
                          className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                        >
                          <Card
                            className="bg-white border-gray-700 hover:bg-gray-700 cursor-pointer transition duration-200"
                            onClick={() => handleVideoClick(video.video_id)}
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
                                <h2 className="text-lg font-semibold line-clamp-2 text-black">
                                  {video.title}
                                </h2>
                                <p className="text-sm text-black">
                                  {new Date(video.published_at).toLocaleDateString()}
                                </p>
                                <div className="flex gap-4 text-sm text-black">
                                  <span>{Number(video.view_count).toLocaleString()} views</span>
                                  {video.like_count && (
                                    <span>{Number(video.like_count).toLocaleString()} likes</span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
                      <CarouselPrevious className="left-0 md:-left-12" />
                      <CarouselNext className="right-0 md:-right-12" />
                    </div>
                  </Carousel>
                </div>

                {/* Analytics Chart */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Playlist Analytics</h2>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <Chart data={chartData} />
                  </div>
                </div>
              </div>
            )}

            {/* Video Popup */}
            {selectedVideoId && (
              <VideoPopup
                videoId={selectedVideoId}
                onClose={() => setSelectedVideoId(null)}
              />
            )}
          </div>
        )}

        {/* Analytics Component */}
        {activeComponent === "analytics" && (
          <VideoAnalytics 
            playlistdata={playlistVideos}
            playlisturl={playlisturl}
            // isGuest={session?.user?.isGuest}
          />
        )}

        {/* Settings Component */}
        {activeComponent === "settings" && userData && (
          <Settings 
            userdata={userData}
            // isGuest={session?.user?.isGuest}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;