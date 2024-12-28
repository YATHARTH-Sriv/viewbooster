import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ThumbsUp, MessageCircle, Star } from "lucide-react";
import axios from "axios";
import Image from "next/image";

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

  const formatNumber = (num?: string) => {
    if (!num) return "0";
    const n = parseInt(num);
    if (n >= 1000000) {
      return (n / 1000000).toFixed(1) + "M";
    } else if (n >= 1000) {
      return (n / 1000).toFixed(1) + "K";
    }
    return n.toString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold leading-tight">
            {loading ? "Loading Video Details..." : videoData?.title}
          </DialogTitle>
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="w-fit">
              Video Details
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={videoData?.thumbnail as string}
                alt={videoData?.title as string}
                className="object-cover"
                fill
                sizes="(max-width: 300px) 40vw, (max-width: 500px) 30vw, 20vw"
                priority
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Published on {formatDate(videoData?.publishedAt)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <p className="text-sm font-medium text-gray-300">Views</p>
                  <p className="text-xl font-bold text-white">{formatNumber(videoData?.viewCount)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                  <ThumbsUp className="h-5 w-5 text-green-400" />
                  <p className="text-sm font-medium text-gray-300">Likes</p>
                  <p className="text-xl font-bold text-white">{formatNumber(videoData?.likeCount)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                  <MessageCircle className="h-5 w-5 text-purple-400" />
                  <p className="text-sm font-medium text-gray-300">Comments</p>
                  <p className="text-xl font-bold text-white">{formatNumber(videoData?.commentCount)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <p className="text-sm font-medium text-gray-300">Favorites</p>
                  <p className="text-xl font-bold text-white">{formatNumber(videoData?.favoriteCount)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoPopup;
