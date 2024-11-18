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
    <div className="absolute bottom-0 left-0 p-3 flex m-h-full overflow-hidden">
      <div
        className={`border-2 p-3 flex flex-col gap-2 bg-glass backdrop-blur-md duration-300 ${
          trackList.length === 0 && "translate-y-20"
        }`}
      >
        <div className="w-80 flex flex-row justify-between items-center gap-3">
          <button className="flex flex-row items-center flex-1" onClick={handleCollapse}>
            <MdArrowDropDown className={`text-2xl ${collapsed && "-rotate-90"}`} />
            <div className="font-bold">Track List ({trackList.length})</div>
          </button>
          <button className="button sm" onClick={handleCreatePlaylist}>
            Create playlist
          </button>
        </div>
        {trackList.length > 0 && !collapsed && (
          <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-slim max-h-96">
            {trackList.map((track, index) => (
              <div className="flex flex-row justify-start items-center gap-3" key={index}>
                <a
                  className="w-12 h-12 bg-cover"
                  style={{ backgroundImage: `url(${track.album?.images[0].url})` }}
                  href={track.album?.external_urls.spotify}
                  target="_blank"
                />
                <div className="w-64 flex flex-col gap-1">
                  <a
                    className="whitespace-nowrap text-ellipsis overflow-hidden hover:underline"
                    href={track.external_urls.spotify}
                    target="_blank"
                  >
                    {track.name}
                  </a>
                  <a
                    className="opacity-60 whitespace-nowrap text-ellipsis overflow-hidden hover:underline"
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
