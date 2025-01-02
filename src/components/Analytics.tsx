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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VideoAnalyticsProps {
  title: string;
  video_id: string;
  view_count: string;
  like_count?: string | undefined;
  published_at?: string;
  comment_count?: string | undefined;
}

// const tagAnalysis = [
//   { tag: "#coding", frequency: 15, avgViews: 28000, avgEngagement: "8.5%" },
//   { tag: "#tutorial", frequency: 12, avgViews: 25000, avgEngagement: "7.2%" },
//   { tag: "#tech", frequency: 10, avgViews: 22000, avgEngagement: "6.8%" },
//   { tag: "#programming", frequency: 8, avgViews: 20000, avgEngagement: "6.5%" },
//   { tag: "#developer", frequency: 7, avgViews: 18000, avgEngagement: "5.9%" },
// ];

// Convert string values to numbers for charts
const processData = (data: VideoAnalyticsProps[]) => {
  return data.map(item => ({
    ...item,
    view_count: parseInt(item.view_count, 10),
    like_count: item.like_count ? parseInt(item.like_count, 10) : 0,
    comment_count: item.comment_count ? parseInt(item.comment_count, 10) : 0
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

// Custom Tooltip for Likes Chart
const LikesCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { title, like_count } = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-md">
        <p className="font-bold">{`Title: ${title}`}</p>
        <p>{`Likes: ${formatNumber(like_count)}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Comment Chart
const CommentCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { title, comment_count } = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-md">
        <p className="font-bold">{`Title: ${title}`}</p>
        <p>{`Comments: ${formatNumber(comment_count)}`}</p>
      </div>
    );
  }
  return null;
};

const ViewsCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { title, view_count } = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-md">
        <p className="font-bold">{`Title: ${title}`}</p>
        <p>{`Views: ${formatNumber(view_count)}`}</p>
      </div>
    );
  }
  return null;
};

const VideoAnalytics = ({ playlistdata }: { playlistdata: VideoAnalyticsProps[] }) => {
  const processedData = processData(playlistdata);

  return (
    <div className="space-y-6 p-6 bg-gray-950">
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
                  <YAxis 
                    stroke="#9ca3af" 
                    tickFormatter={formatNumber}
                  />
                  {/* <XAxis dataKey="title" stroke="#9ca3af" /> */}
                  <Tooltip content={<ViewsCustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="view_count"
                    stroke="#3b82f6"
                    fill="url(#viewsGradient)"
                  />
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
                  <YAxis 
                    stroke="#9ca3af"
                    tickFormatter={formatNumber}
                  />
                  {/* <XAxis dataKey="title" stroke="#9ca3af" /> */}
                  <Tooltip content={<LikesCustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="like_count"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2 }}
                  />
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
                  <YAxis 
                    stroke="#9ca3af"
                    tickFormatter={formatNumber}
                  />
                  {/* <XAxis dataKey="title" stroke="#9ca3af" /> */}
                  <Tooltip content={<CommentCustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="comment_count"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tag Analysis Table */}
        {/* <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Tags</CardTitle>
          </CardHeader>
          {/* <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Tag</TableHead>
                  <TableHead className="text-gray-300 text-right">Frequency</TableHead>
                  <TableHead className="text-gray-300 text-right">Avg. Views</TableHead>
                  <TableHead className="text-gray-300 text-right">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tagAnalysis.map((row) => (
                  <TableRow key={row.tag} className="border-gray-800">
                    <TableCell className="font-medium text-blue-400">{row.tag}</TableCell>
                    <TableCell className="text-right text-gray-300">{row.frequency}</TableCell>
                    <TableCell className="text-right text-gray-300">{row.avgViews.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-gray-300">{row.avgEngagement}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent> */}
          {/* <p className=" text-white text-3xl ">Rolling out in next version</p> */}
        {/* </Card> */} 
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Tags</CardTitle>
          </CardHeader>
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-white text-3xl">Rolling out in next version</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalytics;