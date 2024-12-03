import { Timestamp } from "firebase/firestore";

export interface Track {
  id: string;
  album: Album;
  artists: Artist[];
  duration_ms: number;
  url: string;
  name: string;
  preview_url: string;
  uri: string;
}

export interface Album {
  id: string;
  url: string;
  image: string;
  name: string;
}

export interface Artist {
  id: string;
  name: string;
  url: string;
}

export interface TreeNode<T> {
  id: string;
  value: T;
  children: TreeNode<T>[];
  parent: TreeNode<T> | null;
  selected: boolean;
}

export interface Sphere {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
  rootNode: TreeNode<Track>;
}

export interface TrackTreeContextType {
  rootNode: TreeNode<Track> | null;
  sphere: Sphere | null;
  updateNode: (nodeToUpdate: TreeNode<Track>) => void;
  addChildrenToNode: (
    parentNode: TreeNode<Track>,
    newChildren: Track[]
  ) => void;
  initializeTree: (sphere: Sphere) => void;
  getTrackList: () => Track[];
  getTracks: () => Track[];
  selectNode: (node: TreeNode<Track>) => void;
  deselectNode: (node: TreeNode<Track>) => void;
  deleteNode: (node: TreeNode<Track>) => void;
}

export function convertTrack(track: SpotifyApi.TrackObjectFull): Track {
  const converted: Track = {
    id: track.id,
    album: {
      id: track.album.id,
      url: track.album.external_urls.spotify,
      image: track.album.images[0].url,
      name: track.album.name,
    },
    artists: track.artists.map((a) => {
      return {
        id: a.id,
        name: a.name,
        url: a.external_urls.spotify,
      };
    }),
    duration_ms: track.duration_ms,
    url: track.external_urls.spotify,
    name: track.name,
    preview_url: track.preview_url,
    uri: track.uri
  };
  return converted;
}
