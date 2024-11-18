import { useCallback } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { useTrackTree } from './TrackTreeContext';
import { TreeNode } from './Types';
import { useAuth } from './AuthContext';

export const useSpotify = (spotifyApi: SpotifyWebApi.SpotifyWebApiJs) => {
  const { user } = useAuth();
  const { addChildrenToNode, updateNode, getTrackList } = useTrackTree();

  const getSeedTracks = (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
    const seedTracks: string[] = [];
    let curr: TreeNode<SpotifyApi.TrackObjectFull> | null = node;
    
    while (curr && seedTracks.length < 5) {
      seedTracks.push(curr.value.id);
      curr = curr.parent;
    }
    
    return seedTracks.join(',');
  };

  const getRecommendations = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>, limit: number) => {
      try {
        const response = await spotifyApi.getRecommendations({
          limit,
          seed_tracks: getSeedTracks(node),
        });
        addChildrenToNode(node, response.tracks as unknown as SpotifyApi.TrackObjectFull[]);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    },
    [spotifyApi, addChildrenToNode]
  );

  const reload = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      try {
        const response = await spotifyApi.getRecommendations({
          limit: 1,
          seed_tracks: getSeedTracks(node),
        });
        const newNode: TreeNode<SpotifyApi.TrackObjectFull> = {
          ...node,
          value: response.tracks[0] as unknown as SpotifyApi.TrackObjectFull,
          children: []
        }
        updateNode(newNode);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }, [spotifyApi, updateNode]
  )

  const createPlaylist = useCallback(async () => {
    if (!user) return;
    const trackList = getTrackList();
    const playlist = await spotifyApi.createPlaylist(user.id, { name: 'SPHERE' });
    await spotifyApi.addTracksToPlaylist(playlist.id, trackList.map(track => track.uri));
    return playlist;
  }, [getTrackList, spotifyApi, user]);

  return { getRecommendations, reload, createPlaylist };
};
