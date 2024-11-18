/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import { TrackTreeContextType, TreeNode } from "./Types";

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const TrackTreeContext = createContext<TrackTreeContextType | undefined>(undefined);

export function TrackTreeProvider({ children }: { children: React.ReactNode }) {
  const [rootNode, setRootNode] = useState<TreeNode<SpotifyApi.TrackObjectFull>>();

  const initializeTree = useCallback((track: SpotifyApi.TrackObjectFull) => {
    const newRootNode: TreeNode<SpotifyApi.TrackObjectFull> = {
      id: generateId(),
      value: track,
      children: [],
      parent: null,
      selected: false,
    };
    setRootNode(newRootNode);
  }, []);

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
    [updateNode]
  );

  const getTrackList = useCallback(() => {
    let queue = [rootNode];
    const tracks = [];
    while (queue.length > 0) {
      const curr = queue.pop();
      if (curr!.selected) {
        tracks.push(curr!.value);
        queue = [...queue, ...curr!.children];
      }
    }
    return tracks;
  }, [rootNode]);

  const selectNode = useCallback(
    (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      const updated: TreeNode<SpotifyApi.TrackObjectFull> = {
        ...node,
        selected: true,
      };
      updateNode(updated);
    },
    [updateNode]
  );

  const deselectNode = useCallback(
    (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      const updated: TreeNode<SpotifyApi.TrackObjectFull> = {
        ...node,
        selected: false,
      };
      updateNode(updated);
    },
    [updateNode]
  );

  const deleteNode = useCallback(
    (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
      if (node.parent) {
        const uniqueChildren = [...new Set([...node.parent.children, ...node.children])];
        const updatedParent: TreeNode<SpotifyApi.TrackObjectFull> = {
          ...node.parent,
          children: uniqueChildren,
        };
        updateNode(updatedParent);
      } else {
        if (node.children.length > 0) {
          const newRoot: TreeNode<SpotifyApi.TrackObjectFull> = {
            ...node.children[0],
            id: node.id,
            children: node.children.slice(1),
            parent: null
          };
          updateNode(newRoot);
        } else {
          setRootNode(undefined);
        }
      }
    },
    [updateNode]
  );

  return (
    <TrackTreeContext.Provider
      value={{
        rootNode,
        updateNode,
        addChildrenToNode,
        initializeTree,
        getTrackList,
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
