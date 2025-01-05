import { google } from 'googleapis';
import { getEmbeddings, getPineconeClient, loadIntoPinecone } from '@/lib/ai/embedding';

const youtube = google.youtube('v3');
const apiKey = process.env.YOUTUBE_API_KEY as string;

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

export async function getCompetitorPlaylists(playlisturl: string) {
  try {
    // Step 1: Fetch the original playlist details
    const playlistId = playlisturl.split("list=")[1];
    const playlistDetails = await youtube.playlists.list({
      key: apiKey,
      part: ['snippet'],
      id: [playlistId],
    });

    const sourcePlaylist = playlistDetails.data.items?.[0];
    if (!sourcePlaylist?.snippet) {
      throw new Error('Playlist not found');
    }

    const sourcePlaylistTitle = sourcePlaylist.snippet.title;
    const sourcePlaylistDescription = sourcePlaylist.snippet.description || '';

    // Step 2: Embed and save the original playlist to Pinecone
    if(sourcePlaylistTitle){
    const embeddedResult = await getEmbeddings(sourcePlaylistTitle);
    const sourcePlaylistEmbedding = embeddedResult.data[0].embedding; // Embedding of the original playlist title
    await loadIntoPinecone(sourcePlaylistEmbedding, 'ytstats', sourcePlaylistTitle);

    // Extract keywords from the original playlist title and description
    const keywords = new Set<string>();
    const titleWords = sourcePlaylistTitle.toLowerCase().split(/\s+/) || [];
    titleWords.forEach((word) => keywords.add(word));
    const descriptionWords = sourcePlaylistDescription.toLowerCase().split(/\s+/) || [];
    descriptionWords.forEach((word) => keywords.add(word));

    // Step 3: Search for related playlists
    const searchQuery = Array.from(keywords).slice(0, 5).join(' '); // Use top 5 keywords
    const playlistSearch = await youtube.search.list({
      key: apiKey,
      part: ['snippet'],
      q: searchQuery,
      type: ['playlist'],
      maxResults: 10,
      relevanceLanguage: 'en',
    });

    const relatedPlaylists: CompetitorPlaylist[] = [];
    for (const item of playlistSearch.data.items || []) {
      if (!item.id?.playlistId || !item.snippet) continue;

      // Skip if it's the source playlist
      if (item.id.playlistId === playlistId) continue;

      const detailedPlaylist = await youtube.playlists.list({
        key: apiKey,
        part: ['snippet', 'contentDetails'],
        id: [item.id.playlistId],
      });

      const playlist = detailedPlaylist.data.items?.[0];
      if (!playlist?.contentDetails || !playlist.snippet) continue;
    
      const relatedPlaylistTitle = playlist.snippet.title;
      if(relatedPlaylistTitle){
      const relatedPlaylistEmbedding = await getEmbeddings(relatedPlaylistTitle);

      // Save related playlist embedding with metadata
      await loadIntoPinecone(relatedPlaylistEmbedding.data[0].embedding, 'ytstats', relatedPlaylistTitle);
      }
      // Add the playlist metadata
      relatedPlaylists.push({
        playlistId: item.id.playlistId,
        title: relatedPlaylistTitle || '',
        channelId: playlist.snippet.channelId || '',
        channelTitle: playlist.snippet.channelTitle || '',
        videoCount: parseInt(playlist.contentDetails.itemCount?.toString() || '0'),
        description: playlist.snippet.description || '',
        thumbnails: {
          default: playlist.snippet.thumbnails?.default
            ? { url: playlist.snippet.thumbnails.default.url || null }
            : undefined,
          medium: playlist.snippet.thumbnails?.medium
            ? { url: playlist.snippet.thumbnails.medium.url || null }
            : undefined,
          high: playlist.snippet.thumbnails?.high
            ? { url: playlist.snippet.thumbnails.high.url || null }
            : undefined,
        },
      });
    }
    console.log(relatedPlaylists);
    // Step 4: Query Pinecone for the top 5 most similar playlists
    const topK = 5;
    const client = await getPineconeClient();
    const pineconeIndex = await client.index('ytstats');
    const namespace = pineconeIndex.namespace('ytstats');
    const queryResult = await namespace.query({
      topK,
      vector: sourcePlaylistEmbedding,
      includeMetadata: true, // Include metadata to match by playlistId
    });
    console.log(queryResult);
    // Step 5: Match Pinecone results with related playlists
    const sortedPlaylists = queryResult.matches
      .map((match: any) => {
        const title = match.metadata?.title; // Use metadata to find matching playlist
        const item= relatedPlaylists.find((pl) => pl.title === title);
        console.log(item);
        return item;
      })
      .filter((pl: CompetitorPlaylist | undefined) => pl !== undefined);

    return {
      sourcePlaylistTitle,
      relatedPlaylists: sortedPlaylists,
    };
    }
  } catch (error) {
    console.error('Error in finding related playlists:', error);
    throw new Error('Failed to find related playlists');
  }
}
