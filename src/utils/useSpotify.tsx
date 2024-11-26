import { useCallback } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "./TrackTreeContext";
import { TreeNode } from "./Types";
import { useAuth } from "./AuthContext";

export const useSpotify = (spotifyApi: SpotifyWebApi.SpotifyWebApiJs) => {
  const { user } = useAuth();
  const { addChildrenToNode, updateNode, getTrackList, getTracks } = useTrackTree();

  const getSeedTracks = useCallback((node: TreeNode<SpotifyApi.TrackObjectFull>) => {
    const seedTracks: SpotifyApi.TrackObjectFull[] = [];
    let curr: TreeNode<SpotifyApi.TrackObjectFull> | null = node;
    while (curr && seedTracks.length < 5) {
      seedTracks.push(curr.value);
      curr = curr.parent;
    }
    return seedTracks;
  }, []);

  const generateRecommendations = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>, limit: number) => {
      try {
        const seedTracks = getSeedTracks(node);
        const features = await spotifyApi.getAudioFeaturesForTracks(seedTracks.map((t) => t.id));
        const count = features.audio_features.length;
        const calculateAverage = (key: string) =>
          features.audio_features.reduce((sum, obj: any) => sum + obj[key], 0) / count;
        const averageFeatures = {
          acousticness: calculateAverage("acousticness"),
          danceability: calculateAverage("danceability"),
          energy: calculateAverage("energy"),
          instrumentalness: calculateAverage("instrumentalness"),
          key: calculateAverage("key"),
          liveness: calculateAverage("liveness"),
          loudness: calculateAverage("loudness"),
          mode: calculateAverage("mode"),
          speechiness: calculateAverage("speechiness"),
          tempo: calculateAverage("tempo"),
          time_signature: calculateAverage("time_signature"),
          valence: calculateAverage("valence"),
        };
        const uniqueTracks: SpotifyApi.TrackObjectFull[] = [];
        const seenTrackNames = new Set(getTracks().map((t) => t.name));
        const maxAttempts = 2;
        const batchSize = 10;

        for (let attempts = 0; attempts < maxAttempts && uniqueTracks.length < limit; attempts++) {
          const response = await spotifyApi.getRecommendations({
            limit: batchSize,
            market: user!.country,
            seed_tracks: seedTracks
              .map((t) => t.id)
              .slice(0, 5)
              .join(","),
            ...(node.parent && {
              target_danceability: averageFeatures.danceability,
              target_energy: averageFeatures.energy,
            }),
          });

          for (const track of response.tracks) {
            if (!seenTrackNames.has(track.name) && track.preview_url) {
              uniqueTracks.push(track as SpotifyApi.TrackObjectFull);
              seenTrackNames.add(track.name);
              if (uniqueTracks.length >= limit) break;
            }
          }
        }

        return uniqueTracks.slice(0, limit);
      } catch (error) {
        console.error("Error in generateRecommendations:", error);
        return [];
      }
    },
    [getSeedTracks, getTracks, spotifyApi]
  );

  const getRecommendations = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>, limit: number) => {
      try {
        const tracks = await generateRecommendations(node, limit);
        addChildrenToNode(node, tracks as SpotifyApi.TrackObjectFull[]);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    },
    [generateRecommendations, addChildrenToNode]
  );

  const reload = useCallback(
    async (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      try {
        const tracks = await generateRecommendations(node, 1);
        const newNode: TreeNode<SpotifyApi.TrackObjectFull> = {
          ...node,
          value: tracks[0] as SpotifyApi.TrackObjectFull,
          children: [],
        };
        updateNode(newNode);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    },
    [generateRecommendations, updateNode]
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
