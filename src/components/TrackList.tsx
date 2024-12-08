import { useEffect, useRef, useState } from "react";
import { useTrackTree } from "../utils/TrackTreeContext";
import { useSpotify } from "../utils/useSpotify";
import SpotifyWebApi from "spotify-web-api-js";
import { MdArrowDropDown } from "react-icons/md";
import { updateSphereDescription, updateSphereTitle } from "../utils/FirestoreService";
import { useAuth } from "../utils/AuthContext";
import { Track } from "../utils/Types";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackList({ spotifyApi }: Props) {
  const { user } = useAuth();
  const { sphere, rootNode, getTrackList } = useTrackTree();
  const [trackList, setTrackList] = useState<Track[]>([]);
  const { createPlaylist } = useSpotify(spotifyApi);
  const [collapsed, setCollapsed] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [title, setTitle] = useState(sphere?.title || "");
  const [description, setDescription] = useState(sphere?.description || "");

  useEffect(() => {
    if (!rootNode) return;
    setTrackList(getTrackList());
  }, [getTrackList, rootNode]);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(Math.min(height, 288));
    }
  }, [trackList]);

  useEffect(() => {
    setTitle(sphere?.title || "");
    setDescription(sphere?.description || "");
  }, [sphere]);

  const handleCreatePlaylist = async () => {
    const playlist = await createPlaylist();
    window.open(playlist?.external_urls.spotify, "_blank", "noreferrer");
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (user && sphere) {
      updateSphereTitle(user.id, sphere, e.target.value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    if (user && sphere) {
      updateSphereDescription(user.id, sphere, e.target.value);
    }
  };

  return (
    <div className="absolute top-16 sm:top-0 left-0 p-3 sm:pl-20 w-full pointer-events-none">
      <div className="w-full sm:w-96 p-3 flex flex-col bg-lightGlass rounded-lg backdrop-blur-lg pointer-events-auto">
        <input
          className="unstyled text-xl px-2 py-1 rounded bg-transparent duration-300 hover:bg-lightGlass focus:bg-lightGlass"
          value={title}
          onChange={handleTitleChange}
        />
        <input
          className="unstyled px-2 py-1 rounded bg-transparent duration-300 hover:bg-lightGlass focus:bg-lightGlass"
          value={description}
          onChange={handleDescriptionChange}
        />
        {trackList.length > 0 && (
          <>
            <div className="flex flex-row justify-between items-center gap-3 mt-2">
              <button className="flex flex-row items-center flex-1" onClick={handleCollapse}>
                <MdArrowDropDown
                  className={`text-2xl transform transition-transform duration-300 ${
                    collapsed ? "-rotate-90" : "rotate-0"
                  }`}
                />
                <div className="font-bold leading-[0]">Track List ({trackList.length})</div>
              </button>
              <button className="button light sm" onClick={handleCreatePlaylist}>
                Create playlist
              </button>
            </div>
            <div
              ref={contentRef}
              style={{
                maxHeight: collapsed ? "0px" : `${contentHeight}px`,
                opacity: collapsed ? 0 : 1,
                marginTop: collapsed ? 0 : "0.75rem",
              }}
              className="flex flex-col gap-3 overflow-y-auto scrollbar-slim transition-all duration-300 ease-in-out pr-2"
            >
              {trackList.map((track, index) => (
                <div className="flex flex-row justify-start items-center gap-3" key={index}>
                  <a className="w-12" href={track.album.url} target="_blank">
                    <img
                      className="w-12 h-12 bg-lighter rounded"
                      src={track.album.image}
                      alt={track.album.name}
                    />
                  </a>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <a
                      className="leading-[1.25] whitespace-nowrap text-ellipsis overflow-hidden hover:underline"
                      href={track.url}
                      target="_blank"
                    >
                      {track.name}
                    </a>
                    <a
                      className="leading-[1.25] whitespace-nowrap text-ellipsis overflow-hidden hover:underline opacity-60"
                      href={track.artists[0].url}
                      target="_blank"
                    >
                      {track.artists[0].name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
