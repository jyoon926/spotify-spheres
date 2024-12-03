import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { fetchSpheres, fetchSpheresCount } from "../utils/FirestoreService";
import { Link } from "react-router-dom";
import { Sphere, Track, TreeNode } from "../utils/Types";
import { formatDistanceToNow } from "date-fns";

export default function Spheres() {
  const { user } = useAuth();
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [spheresCount, setSpheresCount] = useState<number>(0);

  const loadSpheres = async () => {
    const countResponse = await fetchSpheresCount(user!.id);
    if (countResponse) setSpheresCount(countResponse);
    const spheresResponse = await fetchSpheres(user!.id);
    if (spheresResponse) setSpheres(spheresResponse as Sphere[]);
  };

  const getTrackListFromNode = (node: TreeNode<Track>) => {
    const tracks: Track[] = [];
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
      <div className="w-full pt-24 sm:p-12 flex flex-col gap-6">
        <div className="text-4xl">Your Spheres</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(24rem, 1fr))" }}>
          {spheres.length === 0 ? (
            [...Array(spheresCount)].map((_, index) => (
              <div className="h-[166px] bg-lightGlass rounded-lg placeholder p-5 flex flex-col gap-4 backdrop-blur-lg" key={index}>
                <div className="w-full h-6 bg-lightGlass rounded" />
                <div className="w-full border-t" />
                <div className="w-full h-5 bg-lightGlass rounded" />
                <div className="w-full h-5 bg-lightGlass rounded" />
                <div className="flex flex-row items-center overflow-auto scrollbar-hidden gap-2">
                  <div className="w-12 h-12 rounded bg-lightGlass" />
                  <div className="w-12 h-12 rounded bg-lightGlass" />
                  <div className="w-12 h-12 rounded bg-lightGlass" />
                  <div className="w-12 h-12 rounded bg-lightGlass" />
                  <div className="w-12 h-12 rounded bg-lightGlass" />
                </div>
              </div>
            ))
          ) : (
            <>
              {spheres.map((sphere) => (
                <Link
                  className="bg-lightGlass hover:bg-lighter duration-300 p-5 flex flex-col gap-4 rounded-lg backdrop-blur-lg"
                  to={`/sphere/${sphere.id}`}
                  key={sphere.id}
                >
                  <div className="text-xl leading-tight">{sphere.title}</div>
                  <div className="w-full border-t" />
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis leading-tight">
                    {sphere.description}
                  </div>
                  <div className="text-base opacity-60">
                    Updated {formatDistanceToNow(sphere.lastEditedAt.toDate())} ago
                  </div>
                  <div className="flex flex-row items-center overflow-auto scrollbar-hidden gap-2">
                    {getTrackListFromNode(sphere.rootNode).map((track) => (
                      <img className="w-12 h-12 rounded" src={track.album.image} alt="" key={track.id} />
                    ))}
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
