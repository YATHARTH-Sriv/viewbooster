import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Eye, ThumbsUp, MessageCircle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import PlaylistComparison, { PlaylistComparisonProps } from "./Playlistcomparison";
import axios from "axios";

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

const VideoAnalytics = ({ playlistdata, playlisturl }: { playlistdata: VideoAnalyticsProps[], playlisturl: string }) => {
  const [comparisonData, setComparisonData] = useState<PlaylistComparisonProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const processedData = processData(playlistdata);
  
  const getComparisonData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/competition', { playlisturl });
      setComparisonData(response.data);
    } catch (err) {
      setError('Failed to fetch comparison data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const mostWatched = processedData.reduce((prev, curr) => (curr.view_count > prev.view_count ? curr : prev), processedData[0]);
  const leastWatched = processedData.reduce((prev, curr) => (curr.view_count < prev.view_count ? curr : prev), processedData[0]);

  return (
    <div className="space-y-6 p-6 bg-gray-950">
      {/* Top Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(processedData.reduce((sum, item) => sum + item.view_count, 0))}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Videos</p>
                <p className="text-2xl font-bold text-white">{processedData.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Button 
                className="w-full flex items-center justify-center space-x-2" 
                onClick={getComparisonData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    <span>Compare with Other Creators </span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="text-red-500 p-4 rounded-md bg-red-500/10 mb-4">
          {error}
        </div>
      )}

      {/* Most and Least Watched Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-blue-500" />
              <span>Most Watched Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={mostWatched.thumbnail}
                  alt={mostWatched.title}
                  className="w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-lg font-semibold text-white truncate">{mostWatched.title}</h2>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(mostWatched.view_count)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{formatNumber(mostWatched.comment_count || 0)}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Published: {new Date(mostWatched.published_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <span>Least Watched Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={leastWatched.thumbnail}
                  alt={leastWatched.title}
                  className="w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-lg font-semibold text-white truncate">{leastWatched.title}</h2>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(leastWatched.view_count)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{formatNumber(leastWatched.comment_count || 0)}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Published: {new Date(leastWatched.published_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Playlist Comparison */}
      {comparisonData && (
        <div className="transition-all duration-300 ease-in-out">
          <PlaylistComparison data={comparisonData} />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span>Video Views Trend</span>
            </CardTitle>
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
                  <Tooltip 
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="view_count" stroke="#3b82f6" fill="url(#viewsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Likes Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              <span>Video Likes Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatNumber} />
                  <Tooltip 
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="like_count" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comments Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-yellow-500" />
              <span>Video Comments Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatNumber} />
                  <Tooltip 
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comment_count" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                  />
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