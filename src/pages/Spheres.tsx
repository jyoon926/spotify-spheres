import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { fetchSpheres } from "../utils/FirestoreService";
import { Link } from "react-router-dom";
import { Sphere, TreeNode } from "../utils/Types";
import { formatDistanceToNow } from 'date-fns';

export default function Spheres() {
  const { user } = useAuth();
  const [spheres, setSpheres] = useState<Sphere[]>([]);

  const loadSpheres = async () => {
    const data = await fetchSpheres(user!.id);
    if (data) setSpheres(data as Sphere[]);
  };

  const getTrackListFromNode = (node: TreeNode<SpotifyApi.TrackObjectFull>) => {
    const tracks: SpotifyApi.TrackObjectFull[] = [];
    let queue = [node];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.selected) {
        tracks.push(curr.value);
      }
      queue.push(...curr.children);
    }
    return tracks;
  };

  useEffect(() => {
    loadSpheres();
  }, []);

  return (
    <div className="w-full p-6 sm:p-3 sm:pl-20">
      <div className="w-full sm:px-12 py-32 flex flex-col gap-6">
        <div className="text-4xl">Your Spheres</div>
        {spheres.length === 0 ? (
          <div className="spinner lg" />
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(24rem, 1fr))' }}>
            {spheres.map((sphere) => (
              <Link className="bg-lightGlass hover:bg-lighter duration-300 p-5 flex flex-col gap-4 rounded-lg" to={`/sphere/${sphere.id}`} key={sphere.id}>
                <div className="text-xl leading-tight">{sphere.title}</div>
                <div className="w-full border-t" />
                <div className="overflow-hidden whitespace-nowrap text-ellipsis leading-tight">{sphere.description}</div>
                <div className="text-base opacity-60">Updated {formatDistanceToNow(sphere.lastEditedAt.toDate())} ago</div>
                <div className="flex flex-row items-center overflow-auto scrollbar-hidden gap-2">
                  {getTrackListFromNode(sphere.rootNode).map((track) => (
                    <img className="w-12 h-12 rounded" src={track.album.images[0].url} alt="" key={track.id} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}