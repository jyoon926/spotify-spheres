import { FaSpotify } from "react-icons/fa";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import { MdAdd, MdHelpOutline, MdInfoOutline, MdList, MdOutlineWidgets } from "react-icons/md";
import { GoGlobe } from "react-icons/go";
import { useState } from "react";

export default function Header() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleLogout = () => {
    setShowMenu(false);
    logout();
  }

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-lightGlass backdrop-blur-lg duration-300 p-3 pt-20 ${showMenu ? "" : "opacity-0 pointer-events-none"} sm:hidden`}>
        <div className="w-full h-full flex flex-col items-start justify-between">
          <div className="w-full">
            <div className="flex flex-col gap-1">
              <Link to="/create" className="flex flex-row gap-4 leading-[0] items-center p-2" onClick={() => setShowMenu(false)}>
                <MdAdd className="text-2xl" /> Create a new Sphere
              </Link>
              <Link to="/spheres" className="flex flex-row gap-4 leading-[0] items-center p-2" onClick={() => setShowMenu(false)}>
                <GoGlobe className="text-2xl" /> Your Spheres
              </Link>
            </div>
            <div className="w-full px-1 py-2">
              <div className="border-t"></div>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/playlist-creator" className="flex flex-row gap-4 leading-[0] items-center p-2" onClick={() => setShowMenu(false)}>
                <MdOutlineWidgets className="text-2xl" /> Simple Playlist Creator
              </Link>
              <Link to="/playlists" className="flex flex-row gap-4 leading-[0] items-center p-2" onClick={() => setShowMenu(false)}>
                <MdList className="text-2xl" /> Your Playlists
              </Link>
            </div>
            <div className="w-full px-1 py-2">
              <div className="border-t"></div>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/help" className="flex flex-row gap-4 leading-[0] items-center p-2" onClick={() => setShowMenu(false)}>
                <MdHelpOutline className="text-2xl" /> Help
              </Link>
              <Link
                className="flex flex-row gap-4 leading-[0] items-center p-2"
                to="/about" onClick={() => setShowMenu(false)}
              >
                <MdInfoOutline className="text-2xl" /> About
              </Link>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1">
              <button className="flex flex-row gap-4 leading-[0] items-center p-2" onClick={handleLogout}>
                <a href={user?.external_urls.spotify} target="_blank">
                  <img className="h-6 w-6 rounded-full" src={user?.images![0].url} alt="" />
                </a> Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      {isAuthenticated ? (
        <div className="fixed top-0 right-0 w-full h-full flex flex-col justify-start items-start p-3 z-40 gap-2 pointer-events-none">
          <div className="sm:hidden w-full flex flex-row justify-between items-center px-4 py-3 bg-lightGlass backdrop-blur-md rounded-lg pointer-events-auto">
            <div className="flex flex-row gap-5 items-center">
              <Link className="flex flex-row items-center gap-2 text-lg" to="/">
                <FaSpotify className="text-2xl" />
                Spotify Spheres
              </Link>
            </div>
            <button className="py-1 flex flex-col gap-1" onClick={() => setShowMenu(prev => !prev)}>
              <div className="w-8 border-t border-foreground"></div>
              <div className="w-8 border-t border-foreground"></div>
              <div className="w-8 border-t border-foreground"></div>
            </button>
          </div>
          <div className="h-full p-2 bg-lightGlass backdrop-blur-md rounded-lg pointer-events-auto hidden sm:flex">
            <div className="h-full flex flex-col items-start justify-between duration-300 w-10 hover:w-64 overflow-hidden">
              <div>
                <div className="flex flex-col gap-1">
                  <Link to="/" className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2 text-lg font-bold">
                    <FaSpotify className="text-2xl" /> Spotify Spheres
                  </Link>
                </div>
                <div className="w-full px-1 py-2">
                  <div className="border-t"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link to="/create" className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2">
                    <MdAdd className="text-2xl" /> Create a new Sphere
                  </Link>
                  <Link to="/spheres" className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2">
                    <GoGlobe className="text-2xl" /> Your Spheres
                  </Link>
                </div>
                <div className="w-full px-1 py-2">
                  <div className="border-t"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link to="/playlist-creator" className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2">
                    <MdOutlineWidgets className="text-2xl" /> Simple Playlist Creator
                  </Link>
                  <Link to="/playlists" className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2">
                    <MdList className="text-2xl" /> Your Playlists
                  </Link>
                </div>
                <div className="w-full px-1 py-2">
                  <div className="border-t"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link to="/help" className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2">
                    <MdHelpOutline className="text-2xl" /> Help
                  </Link>
                  <Link
                    className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2"
                    to="/about"
                  >
                    <MdInfoOutline className="text-2xl" /> About
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <button className="w-64 flex flex-row gap-4 leading-[0] items-center duration-300 hover:bg-lighter rounded-full p-2" onClick={logout}>
                    <a href={user?.external_urls.spotify} target="_blank">
                      <img className="h-6 w-6 rounded-full" src={user?.images![0].url} alt="" />
                    </a> Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 right-0 w-full flex flex-col justify-center items-center p-3 z-40 gap-3">
          <div className="flex flex-row justify-between items-center w-[400px] py-3 px-4 bg-lightGlass rounded-lg">
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
