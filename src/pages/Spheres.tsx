import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { fetchSpheres } from "../utils/FirestoreService";
import { Link } from "react-router-dom";
import { Sphere } from "../utils/Types";
import { formatDistanceToNow } from 'date-fns';

export default function Spheres() {
  const { user } = useAuth();
  const [spheres, setSpheres] = useState<Sphere[]>([]);

  const loadSpheres = async () => {
    const data = await fetchSpheres(user!.id);
    if (data) setSpheres(data as Sphere[]);
  };

  useEffect(() => {
    loadSpheres();
  }, []);

  return (
    <div className="w-full p-3 pl-20">
      <div className="w-full sm:px-10 py-16 flex flex-col gap-6">
        <div className="text-4xl">Your Spheres</div>
        {spheres.length === 0 ? (
          <div className="spinner lg" />
        ) : (
          <div className="flex flex-row gap-3">
            {spheres.map((sphere) => (
              <Link className="button light p-5 flex flex-col gap-3 rounded-lg w-96" to={`/sphere/${sphere.id}`} key={sphere.id}>
                <div className="text-xl">{sphere.title}</div>
                <div className="overflow-hidden whitespace-nowrap text-ellipsis">{sphere.description}</div>
                <div className="text-base opacity-60">Updated {formatDistanceToNow(sphere.lastEditedAt.toDate())} ago</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}