import { useCallback } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "./TrackTreeContext";
import { convertTrack, Track, TreeNode } from "./Types";
import { useAuth } from "./AuthContext";

export const useSpotify = (spotifyApi: SpotifyWebApi.SpotifyWebApiJs) => {
  const { user } = useAuth();
  const { addChildrenToNode, updateNode, getTrackList, getTracks } = useTrackTree();

  const getSeedTracks = useCallback((node: TreeNode<Track>) => {
    const seedTracks: Track[] = [];
    let curr: TreeNode<Track> | null = node;
    while (curr && seedTracks.length < 5) {
      seedTracks.push(curr.value);
      curr = curr.parent;
    }
    return seedTracks;
  }, []);

  const generateRecommendations = useCallback(
    async (node: TreeNode<Track>, limit: number) => {
      try {
        const seedTracks = getSeedTracks(node);
        // const features = await spotifyApi.getAudioFeaturesForTracks(seedTracks.map((t) => t.id));
        // const count = features.audio_features.length;
        // const calculateAverage = (key: string) =>
        //   features.audio_features.reduce((sum, obj: any) => sum + obj[key], 0) / count;
        // const averageFeatures = {
        //   acousticness: calculateAverage("acousticness"),
        //   danceability: calculateAverage("danceability"),
        //   energy: calculateAverage("energy"),
        //   instrumentalness: calculateAverage("instrumentalness"),
        //   key: calculateAverage("key"),
        //   liveness: calculateAverage("liveness"),
        //   loudness: calculateAverage("loudness"),
        //   mode: calculateAverage("mode"),
        //   speechiness: calculateAverage("speechiness"),
        //   tempo: calculateAverage("tempo"),
        //   time_signature: calculateAverage("time_signature"),
        //   valence: calculateAverage("valence"),
        // };
        const uniqueTracks: Track[] = [];
        const seenTrackNames = new Set(getTracks().map((t) => t.name));
        const maxAttempts = 2;
        const batchSize = 10;

        for (let attempts = 0; attempts < maxAttempts && uniqueTracks.length < limit; attempts++) {
          const response = await spotifyApi.getRecommendations({
            limit: batchSize,
            seed_tracks: seedTracks
              .map((t) => t.id)
              .slice(0, 5)
              .join(","),
            // ...(node.parent && {
            //   target_danceability: averageFeatures.danceability,
            //   target_energy: averageFeatures.energy,
            // }),
          });

          const tracks = response.tracks as SpotifyApi.TrackObjectFull[];
          for (let track of tracks) {
            if (!seenTrackNames.has(track.name) && track.preview_url) {
              uniqueTracks.push(convertTrack(track));
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
    async (node: TreeNode<Track>, limit: number) => {
      try {
        const tracks = await generateRecommendations(node, limit);
        addChildrenToNode(node, tracks);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    },
    [generateRecommendations, addChildrenToNode]
  );

  const reload = useCallback(
    async (node: TreeNode<Track>) => {
      try {
        const tracks = await generateRecommendations(node, 1);
        const newNode: TreeNode<Track> = {
          ...node,
          value: tracks[0],
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
