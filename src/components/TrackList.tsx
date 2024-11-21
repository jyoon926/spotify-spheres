import { useEffect, useState } from "react";
import { useTrackTree } from "../utils/TrackTreeContext";
import { useSpotify } from "../utils/useSpotify";
import SpotifyWebApi from "spotify-web-api-js";
import { MdArrowDropDown } from "react-icons/md";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackList({ spotifyApi }: Props) {
  const { rootNode, getTrackList } = useTrackTree();
  const [trackList, setTrackList] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const { createPlaylist } = useSpotify(spotifyApi);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (!rootNode) return;
    setTrackList(getTrackList());
  }, [getTrackList, rootNode]);

  const handleCreatePlaylist = async () => {
    const playlist = await createPlaylist();
    window.open(playlist?.external_urls.spotify, "_blank", "noreferrer");
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="absolute top-12 left-0 p-3 w-full sm:w-auto pointer-events-none">
      <div
        className={`w-full sm:w-96 border-2 p-3 flex flex-col gap-3 bg-glass backdrop-blur-lg duration-300 pointer-events-auto ${
          trackList.length === 0 && "-translate-x-[110%] opacity-0"
        }`}
      >
        <div className="flex flex-row justify-between items-center gap-3">
          <button className="flex flex-row items-center flex-1" onClick={handleCollapse}>
            <MdArrowDropDown className={`text-2xl ${collapsed && "-rotate-90"}`} />
            <div className="font-bold">Track List ({trackList.length})</div>
          </button>
          <button className="button sm" onClick={handleCreatePlaylist}>
            Create playlist
          </button>
        </div>
        {trackList.length > 0 && !collapsed && (
          <div className="flex flex-col gap-3 overflow-y-scroll scrollbar-slim max-h-96">
            {trackList.map((track, index) => (
              <div className="flex flex-row justify-start items-center gap-3" key={index}>
                <a className="w-12" href={track.album?.external_urls.spotify} target="_blank">
                  <img
                    className="w-12 h-12 bg-lighter"
                    src={track.album?.images[0].url}
                    alt={track.album?.images[0].url}
                  />
                </a>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <a
                    className="leading-[1.25] whitespace-nowrap text-ellipsis overflow-hidden hover:underline"
                    href={track.external_urls.spotify}
                    target="_blank"
                  >
                    {track.name}
                  </a>
                  <a
                    className="leading-[1.25] whitespace-nowrap text-ellipsis overflow-hidden hover:underline opacity-60"
                    href={track.artists[0].external_urls.spotify}
                    target="_blank"
                  >
                    {track.artists[0].name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
