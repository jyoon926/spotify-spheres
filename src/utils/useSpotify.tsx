import { useCallback } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "./TrackTreeContext";
import { TreeNode } from "./Types";
import { useAuth } from "./AuthContext";

export const useSpotify = (spotifyApi: SpotifyWebApi.SpotifyWebApiJs) => {
  const { user } = useAuth();
  const { addChildrenToNode, updateNode, getTrackList, getTracks } = useTrackTree();

  const getSeedTracks = (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
    const seedTracks: SpotifyApi.TrackObjectFull[] = [];
    let curr: TreeNode<SpotifyApi.TrackObjectFull> | null = node;
    while (curr && seedTracks.length < 5) {
      seedTracks.push(curr.value);
      curr = curr.parent;
    }
    return seedTracks;
  };

  const recommendations = useCallback(async (node: TreeNode<SpotifyApi.TrackObjectFull>, limit: number) => {
    const seedTracks = getSeedTracks(node);
    const features = await spotifyApi.getAudioFeaturesForTracks(seedTracks.map((t) => t.id));
    const count = features.audio_features.length;
    
    const averageFeatures = {
      acousticness: Math.round(features.audio_features.reduce((sum, obj) => sum + obj.acousticness, 0) / count * 10) / 10,
      danceability: Math.round(features.audio_features.reduce((sum, obj) => sum + obj.danceability, 0) / count * 10) / 10,
      energy: Math.round(features.audio_features.reduce((sum, obj) => sum + obj.energy, 0) / count * 10) / 10,
    };

    const uniqueTracks: SpotifyApi.TrackObjectFull[] = [];
    const seenTrackIds = new Set(getTracks().map(t => t.id));
    const maxAttempts = 5;
    let attempts = 0;

    while (uniqueTracks.length < limit && attempts < maxAttempts) {
      try {
        // Request more tracks than needed to increase chances of finding unique ones
        const batchSize = 5;
        const response = await spotifyApi.getRecommendations({
          limit: batchSize,
          seed_tracks: seedTracks.map(t => t.id).join(","),
          target_acousticness: averageFeatures.acousticness,
          target_danceability: averageFeatures.danceability,
          target_energy: averageFeatures.energy,
        });
  
        // Filter out tracks we've seen before
        for (const track of response.tracks) {
          if (!seenTrackIds.has(track.id)) {
            uniqueTracks.push(track as unknown as SpotifyApi.TrackObjectFull);
            seenTrackIds.add(track.id);
            if (uniqueTracks.length >= limit) {
              break;
            }
          }
        }
        attempts++;
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        break;
      }
    }

    return uniqueTracks.slice(0, limit);
  }, []);

  const getRecommendations = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>, limit: number) => {
      try {
        const tracks = await recommendations(node, limit);
        addChildrenToNode(node, tracks as unknown as SpotifyApi.TrackObjectFull[]);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    },
    [spotifyApi, addChildrenToNode]
  );

  const reload = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      try {
        const tracks = await recommendations(node, 1);
        const newNode: TreeNode<SpotifyApi.TrackObjectFull> = {
          ...node,
          value: tracks[0] as unknown as SpotifyApi.TrackObjectFull,
          children: [],
        };
        updateNode(newNode);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    },
    [spotifyApi, updateNode]
  );

  const createPlaylist = useCallback(async () => {
    if (!user) return;
    const trackList = getTrackList();
    const playlist = await spotifyApi.createPlaylist(user.id, { name: "SPHERE" });
    await spotifyApi.addTracksToPlaylist(
      playlist.id,
      trackList.map((track) => track.uri)
    );
    return playlist;
  }, [getTrackList, spotifyApi, user]);

  return { getRecommendations, reload, createPlaylist };
};
