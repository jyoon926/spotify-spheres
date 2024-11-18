import { useAuth } from "../utils/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;
  return (
    <div className="fixed top-0 right-0 flex flex-row gap-3 p-3 z-50">
      <button className="link" onClick={logout}>
        Log out
      </button>
      <a href={user?.external_urls.spotify} target="_blank">
        <img className="h-8 w-8 rounded-full" src={user?.images![0].url} alt="" />
      </a>
    </div>
  );

  // return (
  //   <div className="fixed top-0 left-0 w-full flex justify-center p-3 z-50 pointer-events-none">
  //     <div className="flex flex-row w-full max-w-[500px] h-14 justify-between items-center bg-glass border-2 px-5 backdrop-blur-md pointer-events-auto">
  //       <Link className="link text-lg" to="/">Spotify Spheres</Link>
  //       {isAuthenticated ? (
  //         <div className="flex flex-row gap-3">
  //           <button className="link" onClick={logout}>Log out</button>
  //           <img className="h-8 w-8 rounded-full" src={user?.images![0].url} alt="" />
  //         </div>
  //       ) : (
  //         <div className="flex flex-row gap-3">
  //           <button className="link" onClick={login}>Log in</button>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
