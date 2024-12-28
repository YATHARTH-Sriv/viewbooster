"use client"
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Import ShadCN Skeleton
import axios from 'axios';

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
        const response = await axios.post('/api/videodata', { videoid: videoId });
        setVideoData(response.data.requestedvideodata);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch video data:', error);
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/2 relative">
        {/* Close button positioned inside the card */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-xl bg-gray-200 rounded-full p-2 hover:bg-gray-300"
        >
          X
        </button>
        
        {loading ? (
          <div>
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ) : (
          <div>
            <img
              src={videoData?.thumbnail}
              alt={videoData?.title}
              className="mb-4 rounded"
            />
            <h2 className="text-2xl font-bold mb-4">{videoData?.title}</h2>
            <p className="text-sm text-gray-600">Published: {videoData?.publishedAt}</p>
            <div className="mt-4">
              <p>Views: {videoData?.viewCount}</p>
              <p>Likes: {videoData?.likeCount}</p>
              <p>Favorites: {videoData?.favoriteCount}</p>
              <p>Comments: {videoData?.commentCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPopup;
