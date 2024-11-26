import { FaSpotify } from "react-icons/fa";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import { MdAdd, MdHelpOutline, MdInfoOutline, MdList, MdOutlineWidgets } from "react-icons/md";
import { GoGlobe } from "react-icons/go";

export default function Header() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className="fixed top-0 right-0 w-full h-full flex flex-col justify-start items-start p-3 z-50 gap-2 pointer-events-none">
          <div className="w-full flex flex-row justify-between items-center px-4 py-3 bg-lightGlass backdrop-blur-md rounded-lg pointer-events-auto">
            <div className="flex flex-row gap-5 items-center">
              <Link className="flex flex-row items-center gap-2 text-lg" to="/">
                <FaSpotify className="text-2xl" />
                Spotify Spheres
              </Link>
            </div>
            <div className="flex flex-row gap-5">
              <button className="link" onClick={logout}>
                Log out
              </button>
              <a href={user?.external_urls.spotify} target="_blank">
                <img className="h-8 w-8 rounded-full" src={user?.images![0].url} alt="" />
              </a>
            </div>
          </div>
          <div className="h-full p-2 bg-lightGlass backdrop-blur-md rounded-lg pointer-events-auto">
            <div className="h-full flex flex-col items-start justify-between duration-300 w-10 hover:w-64 overflow-hidden">
              <div>
                <div className="flex flex-col gap-1">
                  <button className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lightGlass rounded-full p-2">
                    <MdAdd className="text-2xl" /> Create a new Sphere
                  </button>
                  <button className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lightGlass rounded-full p-2">
                    <GoGlobe className="text-2xl" /> Your Spheres
                  </button>
                </div>
                <div className="w-full px-1 py-2">
                  <div className="border-t-2"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <button className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lightGlass rounded-full p-2">
                    <MdOutlineWidgets className="text-2xl" /> Simple Playlist Creator
                  </button>
                  <button className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lightGlass rounded-full p-2">
                    <MdList className="text-2xl" /> Your Playlists
                  </button>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <button className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lightGlass rounded-full p-2">
                    <MdHelpOutline className="text-2xl" /> Help
                  </button>
                  <Link
                    className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lightGlass rounded-full p-2"
                    to="/about"
                  >
                    <MdInfoOutline className="text-2xl" /> About
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 right-0 w-full flex flex-col justify-center items-center p-3 z-50 gap-3">
          <div className="flex flex-row justify-between items-center w-[400px] py-3 px-4 bg-lightGlass rounded-full">
            <Link className="flex flex-row items-center gap-2 text-lg" to="/">
              <FaSpotify className="text-2xl" />
              Spotify Spheres
            </Link>
            <div className="flex flex-row gap-7 mr-2">
              <Link className="link" to="/about">
                About
              </Link>
              <button className="link" onClick={login}>
                Log in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
