"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Video } from '@/types/datatypes';
import { Card } from '@/components/ui/card';
import { MdNavigateBefore } from 'react-icons/md';
import { MdNavigateNext } from 'react-icons/md';
import { Chart } from '@/components/graph';
import VideoPopup from '@/components/videopopup';
import { useSession } from 'next-auth/react'; 


function Page() {
  const { data: session } = useSession(); 

  const [playlisturl, setPlaylisturl] = useState('');
  const [playlistvideos, setPlaylistvideos] = useState<Video[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleFetch = async () => {
    const response = await axios.post('/api/playlist', { playlisturl });
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

  // Handle video card click
  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  // Prepare data for the chart
  const chartData = playlistvideos.map((video) => ({
    name: video.title,
    views: Number(video.views),
    date: video.publishedAt,
    likes: video.likeCount ? Number(video.likeCount) : 0,
    comments: video.commentCount ? Number(video.commentCount) : 0,
  }));

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <div className="flex items-center mb-6">
        {session && session.user.image &&  (
          <img
            src={session.user.image}
            alt={session?.user?.name}
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <h1 className="text-2xl font-bold">
          Welcome {session?.user?.name}
        </h1>
      </div>
      <h1 className=' m-2 p-3 ml-5 justify-center'>Youtube Dashboard</h1>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Enter Playlist Link"
          value={playlisturl}
          onChange={(e) => setPlaylisturl(e.target.value)}
          className="p-2 border rounded w-64"
        />
        <button
          onClick={handleFetch}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fetch Stats
        </button>
      </div>

      {playlistvideos.length > 0 && (
        <Card>
          <div className="relative">
            {/* Video Cards */}
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
                    className="flex-shrink-0 w-1/4 p-4"
                    style={{ minWidth: '25%' }}
                  >
                    <div
                      className="p-4 border rounded shadow hover:shadow-lg cursor-pointer"
                      onClick={() => handleVideoClick(video.videoId)}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="mb-4 rounded"
                      />
                      <h2 className="text-lg font-bold">{video.title}</h2>
                      <p className="text-sm text-gray-600">{video.publishedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handlePrevious}
                className={`mx-2 bg-gray-200 p-3 rounded-full shadow-md hover:bg-gray-300 ${
                  visibleIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={visibleIndex <= 0}
              >
                <MdNavigateBefore className="h-6 w-6 text-gray-700" />
              </button>

              <button
                onClick={handleNext}
                className={`mx-2 bg-gray-200 p-3 rounded-full shadow-md hover:bg-gray-300 ${
                  visibleIndex + 4 >= playlistvideos.length
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={visibleIndex + 4 >= playlistvideos.length}
              >
                <MdNavigateNext className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Chart Component */}
      {playlistvideos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-center">Playlist Stats Chart</h2>
          <Chart data={chartData} />
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
  );
}

export default Page;
