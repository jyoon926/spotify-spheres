/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import { TrackTreeContextType, TreeNode } from "./Types";

const TrackTreeContext = createContext<TrackTreeContextType | undefined>(undefined);

export function TrackTreeProvider({ children }: { children: React.ReactNode }) {
  const [rootNode, setRootNode] = useState<TreeNode<SpotifyApi.TrackObjectFull> | null>(null);

  const generateId = useCallback((): string => {
    return Math.random().toString(36).slice(2);
  }, []);

  const initializeTree = useCallback(
    (track: SpotifyApi.TrackObjectFull) => {
      const newRootNode: TreeNode<SpotifyApi.TrackObjectFull> = {
        id: generateId(),
        value: track,
        children: [],
        parent: null,
        selected: false,
      };
      setRootNode(newRootNode);
    },
    [generateId]
  );

  const updateNode = useCallback(
    (nodeToUpdate: TreeNode<SpotifyApi.TrackObjectFull>) => {
      if (!rootNode) return;

      const updateNodeRecursive = (
        current: TreeNode<SpotifyApi.TrackObjectFull>
      ): TreeNode<SpotifyApi.TrackObjectFull> => {
        if (current.id === nodeToUpdate.id) {
          return nodeToUpdate;
        }
        return {
          ...current,
          children: current.children.map((child) => updateNodeRecursive(child)),
        };
      };
      setRootNode(updateNodeRecursive(rootNode));
    },
    [rootNode]
  );

  const addChildrenToNode = useCallback(
    (parentNode: TreeNode<SpotifyApi.TrackObjectFull>, newChildren: SpotifyApi.TrackObjectFull[]) => {
      const childNodes: TreeNode<SpotifyApi.TrackObjectFull>[] = newChildren.map((track) => ({
        id: generateId(),
        value: track,
        children: [],
        parent: parentNode,
        selected: false,
      }));

      const updatedParentNode: TreeNode<SpotifyApi.TrackObjectFull> = {
        ...parentNode,
        children: [...parentNode.children, ...childNodes],
        selected: true,
      };

      updateNode(updatedParentNode);
    },
    [generateId, updateNode]
  );

  const getTrackList = useCallback(() => {
    if (!rootNode) return [];
    const tracks: SpotifyApi.TrackObjectFull[] = [];
    let queue = [rootNode];
    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr && curr.selected) {
        tracks.push(curr.value);
        queue.push(...curr.children);
      }
    }
    return tracks;
  }, [rootNode]);

  const getTracks = useCallback(() => {
    if (!rootNode) return [];
    const tracks: SpotifyApi.TrackObjectFull[] = [];
    let queue = [rootNode];
    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr) {
        tracks.push(curr.value);
        queue.push(...curr.children);
      }
    }
    return tracks;
  }, [rootNode]);

  const selectNode = useCallback(
    (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      updateNode({ ...node, selected: true });
    },
    [updateNode]
  );

  const deselectNode = useCallback(
    (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      updateNode({ ...node, selected: false });
    },
    [updateNode]
  );

  const deleteNode = useCallback(
    (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      if (!rootNode) return;
      if (node.parent) {
        const updatedParent: TreeNode<SpotifyApi.TrackObjectFull> = {
          ...node.parent,
          children: [...node.parent.children.filter((child) => child.id !== node.id), ...node.children],
        };
        updateNode(updatedParent);
      } else if (node.children.length > 0) {
        const newRoot: TreeNode<SpotifyApi.TrackObjectFull> = {
          ...node.children[0],
          id: generateId(),
          children: node.children.slice(1),
          parent: null,
        };
        setRootNode(newRoot);
      } else {
        setRootNode(null);
      }
    },
    [rootNode, generateId, updateNode]
  );

  return (
    <TrackTreeContext.Provider
      value={{
        rootNode,
        updateNode,
        addChildrenToNode,
        initializeTree,
        getTrackList,
        getTracks,
        selectNode,
        deselectNode,
        deleteNode,
      }}
    >
      {children}
    </TrackTreeContext.Provider>
  );
}

export const useTrackTree = () => {
  const context = useContext(TrackTreeContext);
  if (context === undefined) {
    throw new Error("useTrackTree must be used within a TrackTreeProvider");
  }
  return context;
};
