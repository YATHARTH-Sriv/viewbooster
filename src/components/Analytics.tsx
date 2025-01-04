"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface VideoAnalyticsProps {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  view_count: string;
  like_count?: string;
  comment_count?: string;
}

// Convert string values to numbers for charts
const processData = (data: VideoAnalyticsProps[]) => {
  return data.map((item) => ({
    ...item,
    view_count: parseInt(item.view_count, 10),
    like_count: item.like_count ? parseInt(item.like_count, 10) : 0,
    comment_count: item.comment_count ? parseInt(item.comment_count, 10) : 0,
  }));
};

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const VideoAnalytics = ({ playlistdata }: { playlistdata: VideoAnalyticsProps[] }) => {
  const processedData = processData(playlistdata);

  // Find the most and least watched videos
  const mostWatched = processedData.reduce((prev, curr) => (curr.view_count > prev.view_count ? curr : prev), processedData[0]);
  const leastWatched = processedData.reduce((prev, curr) => (curr.view_count < prev.view_count ? curr : prev), processedData[0]);

  return (
    <div className="space-y-6 p-6 bg-gray-950">
      {/* Most and Least Watched Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Most Watched Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img
                src={mostWatched.thumbnail}
                alt={mostWatched.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold text-white">{mostWatched.title}</h2>
              <p className="text-gray-400">Views: {formatNumber(mostWatched.view_count)}</p>
              <p className="text-gray-400">Published: {mostWatched.published_at}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Least Watched Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img
                src={leastWatched.thumbnail}
                alt={leastWatched.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold text-white">{leastWatched.title}</h2>
              <p className="text-gray-400">Views: {formatNumber(leastWatched.view_count)}</p>
              <p className="text-gray-400">Published: {leastWatched.published_at}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Video Views Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatNumber} />
                  <Tooltip />
                  <Area type="monotone" dataKey="view_count" stroke="#3b82f6" fill="url(#viewsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Likes Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Video Likes Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatNumber} />
                  <Tooltip />
                  <Line type="monotone" dataKey="like_count" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comments Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Video Comments Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatNumber} />
                  <Tooltip />
                  <Line type="monotone" dataKey="comment_count" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalytics;
