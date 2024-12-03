/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Sphere, Track, TrackTreeContextType, TreeNode } from "./Types";
import { updateSphereRootNode } from "./FirestoreService";
import { useAuth } from "./AuthContext";

const TrackTreeContext = createContext<TrackTreeContextType | undefined>(undefined);

export function TrackTreeProvider({ children }: { children: React.ReactNode }) {
  const [rootNode, setRootNode] = useState<TreeNode<Track> | null>(null);
  const { user } = useAuth();
  const [sphere, setSphere] = useState<Sphere | null>(null);

  const generateId = useCallback((): string => {
    return Math.random().toString(36).slice(2);
  }, []);

  const initializeTree = useCallback((data: Sphere) => {
    setRootNode(data.rootNode);
    setSphere(data);
  }, []);

  const findNodeById = useCallback(
    (id: string): TreeNode<Track> | undefined => {
      if (!rootNode) return undefined;

      const queue = [rootNode];
      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        if (current.id === id) {
          return current;
        }

        queue.push(...current.children);
      }

      return undefined;
    },
    [rootNode]
  );

  const updateNode = useCallback(
    (nodeToUpdate: TreeNode<Track>) => {
      if (!rootNode) return;

      const updateNodeRecursive = (
        current: TreeNode<Track>
      ): TreeNode<Track> => {
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
    (parentNode: TreeNode<Track>, newChildren: Track[]) => {
      const parent = findNodeById(parentNode.id)!;
      const childNodes: TreeNode<Track>[] = newChildren.map((track) => ({
        id: generateId(),
        value: track,
        children: [],
        parent,
        selected: false,
      }));

      const updatedParentNode: TreeNode<Track> = {
        ...parent,
        children: [...parent.children, ...childNodes],
        selected: true,
      };

      updateNode(updatedParentNode);
    },
    [generateId, updateNode]
  );

  const getTrackList = useCallback(() => {
    if (!rootNode) return [];
    const tracks: Track[] = [];
    let queue = [rootNode];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.selected) {
        tracks.push(curr.value);
      }
      queue.push(...curr.children);
    }
    return tracks;
  }, [rootNode]);

  const getTracks = useCallback(() => {
    if (!rootNode) return [];
    const tracks: Track[] = [];
    let queue = [rootNode];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      tracks.push(curr.value);
      queue.push(...curr.children);
    }
    return tracks;
  }, [rootNode]);

  const selectNode = useCallback(
    (node: TreeNode<Track>) => {
      const currentNode = findNodeById(node.id)!;
      updateNode({ ...currentNode, selected: true });
    },
    [updateNode]
  );

  const deselectNode = useCallback(
    (node: TreeNode<Track>) => {
      const currentNode = findNodeById(node.id)!;
      updateNode({ ...currentNode, selected: false });
    },
    [updateNode]
  );

  const deleteNode = useCallback(
    (node: TreeNode<Track>) => {
      if (!rootNode) return;
      const currentNode = findNodeById(node.id)!;
      if (currentNode.parent) {
        const parent = findNodeById(currentNode.parent.id)!;
        const children = [...parent.children.filter((child) => child.id !== node.id), ...currentNode.children];
        const updatedParent: TreeNode<Track> = {
          ...currentNode.parent,
          children,
        };
        updateNode(updatedParent);
      } else if (currentNode.children.length > 0) {
        const newRoot: TreeNode<Track> = {
          ...currentNode.children[0],
          id: generateId(),
          children: [...currentNode.children[0].children, ...currentNode.children.slice(1)],
          parent: null,
        };
        setRootNode(newRoot);
      } else {
        setRootNode(null);
      }
    },
    [rootNode, generateId, updateNode]
  );

  useEffect(() => {
    if (user && sphere && rootNode) updateSphereRootNode(user.id, sphere, rootNode);
  }, [rootNode]);

  return (
    <TrackTreeContext.Provider
      value={{
        rootNode,
        sphere,
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
