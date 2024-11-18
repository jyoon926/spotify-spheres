export interface TreeNode<T> {
  id: string;
  value: T;
  children: TreeNode<T>[];
  parent: TreeNode<T> | null;
  selected: boolean;
}

export interface TrackTreeContextType {
  rootNode: TreeNode<SpotifyApi.TrackObjectFull> | null;
  updateNode: (nodeToUpdate: TreeNode<SpotifyApi.TrackObjectFull>) => void;
  addChildrenToNode: (
    parentNode: TreeNode<SpotifyApi.TrackObjectFull>,
    newChildren: SpotifyApi.TrackObjectFull[]
  ) => void;
  initializeTree: (track: SpotifyApi.TrackObjectFull) => void;
  getTrackList: () => SpotifyApi.TrackObjectFull[];
  getTracks: () => SpotifyApi.TrackObjectFull[];
  selectNode: (node: TreeNode<SpotifyApi.TrackObjectFull>) => void;
  deselectNode: (node: TreeNode<SpotifyApi.TrackObjectFull>) => void;
  deleteNode: (node: TreeNode<SpotifyApi.TrackObjectFull>) => void;
}
