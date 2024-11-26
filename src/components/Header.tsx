import { useAuth } from "../utils/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;
  return (
    <div className="fixed top-0 right-0 flex flex-row gap-3 p-3 z-50">
      <button className="button light sm" onClick={logout}>
        Log out
      </button>
      <a href={user?.external_urls.spotify} target="_blank">
        <img className="h-8 w-8 rounded-full" src={user?.images![0].url} alt="" />
      </a>
    </div>
  );
}
