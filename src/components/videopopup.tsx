"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton Component
import axios from "axios";

interface VideoPopupProps {
  videoId: string;
  onClose: () => void;
}

interface VideoData {
  viewCount?: string;
  likeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
  publishedAt?: string;
  title?: string;
  thumbnail?: string;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ videoId, onClose }) => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.post("/api/videodata", { videoid: videoId });
        setVideoData(response.data.requestedvideodata);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch video data:", error);
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-3/4 md:w-1/2 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>

        {loading ? (
          <div>
            <Skeleton className="h-52 w-full mb-4 rounded" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-6 w-1/2 mb-3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ) : (
          <div>
            {/* Thumbnail */}
            <img
              src={videoData?.thumbnail}
              alt={videoData?.title}
              className="mb-6 w-full rounded-lg shadow"
            />

            {/* Video Title */}
            <h2 className="text-2xl font-bold mb-4">{videoData?.title}</h2>

            {/* Published Date */}
            <p className="text-sm text-gray-400 mb-6">Published: {videoData?.publishedAt}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-800 p-4 rounded shadow">
                <p className="text-lg font-semibold">Views</p>
                <p className="text-2xl font-bold">{videoData?.viewCount}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded shadow">
                <p className="text-lg font-semibold">Likes</p>
                <p className="text-2xl font-bold">{videoData?.likeCount}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded shadow">
                <p className="text-lg font-semibold">Favorites</p>
                <p className="text-2xl font-bold">{videoData?.favoriteCount}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded shadow">
                <p className="text-lg font-semibold">Comments</p>
                <p className="text-2xl font-bold">{videoData?.commentCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPopup;
