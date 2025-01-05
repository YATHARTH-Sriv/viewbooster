"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import { MessagesSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompetitorPlaylist {
  playlistId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  videoCount: number;
  description: string;
  thumbnails: {
    default?: { url: string | null | undefined };
    medium?: { url: string | null | undefined };
    high?: { url: string | null | undefined };
  };
}

interface CompetitorResponse {
  sourcePlaylistTitle: string;
  relatedPlaylists: CompetitorPlaylist[];
}

function Page() {
  const [playlistId, setPlaylistId] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [apiResponse, setApiResponse] = useState<CompetitorResponse>();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      playlistId: playlistId,
    },
    onResponse: async (res) => {
      const data: CompetitorResponse = await res.json();
      setApiResponse(data);
      console.log(apiResponse);
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I can help you analyze competitors for your YouTube playlist. Just ask me to 'get competitor details' or ask specific questions about your competitors.",
      },
    ],
  });

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistId) {
      setShowChat(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {!showChat ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">YouTube Playlist Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartChat} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter YouTube Playlist ID</label>
                <Input
                  type="text"
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                  placeholder="e.g., PLxxxxxxxxxxxxxxx"
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Start Analysis
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="w-6 h-6" />
              Competitor Analysis Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "assistant"
                          ? "bg-secondary"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.role === "assistant" && apiResponse && (
                        <div className="mt-2 space-y-2">
                          {apiResponse.relatedPlaylists.map((playlist) => (
                            <div
                              key={playlist.playlistId}
                              className="flex items-start gap-4 p-2 border rounded-lg"
                            >
                              {playlist.thumbnails.high?.url && (
                                <img
                                  src={playlist.thumbnails.high.url}
                                  alt={playlist.title}
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold">{playlist.title}</h4>
                                <p className="text-sm text-muted">
                                  {playlist.videoCount} videos by {playlist.channelTitle}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type 'get competitor details' or ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Page;
