import { Timestamp } from "firebase/firestore";

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
  rootNode: TreeNode<SpotifyApi.TrackObjectFull>;
}

export interface TrackTreeContextType {
  rootNode: TreeNode<SpotifyApi.TrackObjectFull> | null;
  sphere: Sphere | null;
  updateNode: (nodeToUpdate: TreeNode<SpotifyApi.TrackObjectFull>) => void;
  addChildrenToNode: (
    parentNode: TreeNode<SpotifyApi.TrackObjectFull>,
    newChildren: SpotifyApi.TrackObjectFull[]
  ) => void;
  initializeTree: (sphere: Sphere) => void;
  getTrackList: () => SpotifyApi.TrackObjectFull[];
  getTracks: () => SpotifyApi.TrackObjectFull[];
  selectNode: (node: TreeNode<SpotifyApi.TrackObjectFull>) => void;
  deselectNode: (node: TreeNode<SpotifyApi.TrackObjectFull>) => void;
  deleteNode: (node: TreeNode<SpotifyApi.TrackObjectFull>) => void;
}
