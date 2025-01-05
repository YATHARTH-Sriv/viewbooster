'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Play, User, VideoIcon } from 'lucide-react'

export interface Playlist {
  playlistId: string,
  title: string,
  channelId: string,
  channelTitle: string,
  videoCount: number,
  description: string,
  thumbnails: {
    default: {
      url: string
    },
    medium: {
      url: string
    },
    high: {
      url: string
    }
  }
}

export interface PlaylistComparisonProps {
  sourcePlaylistTitle: string,
  relatedPlaylists: Playlist[]
}

function PlaylistComparison({data}:{data:PlaylistComparisonProps}) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [isHighlighted, setIsHighlighted] = useState(true)

  useEffect(() => {
    setIsHighlighted(true)
    const timer = setTimeout(() => {
      setIsHighlighted(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [data])

  return (
    <Card className={`${isHighlighted ? 'animate-pulse bg-blue-500/10' : 'bg-gray-900'} transition-colors duration-500 border-gray-800`}>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          This is how usually such content performs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.relatedPlaylists.map((playlist) => (
            <PlaylistThumbnail
              key={playlist.playlistId}
              playlist={playlist}
              setSelectedPlaylist={setSelectedPlaylist}
            />
          ))}
        </div>
        {selectedPlaylist && (
          <PlaylistDialog
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface PlaylistThumbnailProps {
  playlist: Playlist
  setSelectedPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>
  isOriginal?: boolean
}

const PlaylistThumbnail: React.FC<PlaylistThumbnailProps> = ({ playlist, setSelectedPlaylist, isOriginal = false }) => {
  return (
    <div
      className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
      onClick={() => setSelectedPlaylist(playlist)}
    >
      <img
        src={playlist.thumbnails.medium.url}
        alt={playlist.title}
        className="w-full rounded-md mb-2"
      />
      <h3 className="font-medium text-white truncate">{playlist.title}</h3>
      <p className="text-sm text-gray-400 truncate">{playlist.channelTitle}</p>
      {isOriginal && <span className="text-blue-500 text-sm">Original</span>}
    </div>
  )
}

interface PlaylistDialogProps {
  selectedPlaylist: Playlist | null
  setSelectedPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>
}

const PlaylistDialog: React.FC<PlaylistDialogProps> = ({ selectedPlaylist, setSelectedPlaylist }) => {
  return (
    <Dialog open={!!selectedPlaylist} onOpenChange={() => setSelectedPlaylist(null)}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">Playlist Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail Section */}
          <div className="relative group">
            <img
              src={selectedPlaylist?.thumbnails.high.url}
              alt={selectedPlaylist?.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black break-words line-clamp-2">
                {selectedPlaylist?.title}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-black">
                <User className="w-4 h-4" />
                <span className="text-sm">{selectedPlaylist?.channelTitle}</span>
              </div>

              <div className="flex items-center space-x-2 text-black">
                <VideoIcon className="w-4 h-4" />
                <span className="text-sm">{selectedPlaylist?.videoCount} videos</span>
              </div>
            </div>

            {selectedPlaylist?.description && (
              <div className="mt-4">
                <p className="text-sm text-black line-clamp-3">
                  {selectedPlaylist.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlaylistComparison