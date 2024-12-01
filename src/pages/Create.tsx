import { useNavigate } from "react-router-dom";
import SearchTracks from "../components/SearchTracks";
import { useAuth } from "../utils/AuthContext";
import { createSphere } from "../utils/FirestoreService";

export default function Create() {
  const { user, spotifyApi } = useAuth();
  const navigate = useNavigate();

  const handleSelectInitial = async (track: SpotifyApi.TrackObjectFull) => {
    const rootNode = {
      id: Math.random().toString(36).slice(2),
      value: track,
      children: [],
      parent: null,
      selected: false,
    };
    const newSphere = await createSphere(user!.id, rootNode);
    if (newSphere) navigate(`/sphere/${newSphere.id}`);
  }

  return (
    <div className="absolute inset-0 p-6 sm:pl-32 pt-32 flex">
      <SearchTracks spotifyApi={spotifyApi!} onSelected={handleSelectInitial} />
    </div>
  );
}