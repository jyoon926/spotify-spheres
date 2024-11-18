import TrackTreeNode from "./TrackTreeNode";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "../utils/TrackTreeContext";
import SearchTracks from "./SearchTracks";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTree({ spotifyApi }: Props) {
  const { rootNode, initializeTree } = useTrackTree();

  const handleSelectInitial = (track: SpotifyApi.TrackObjectFull) => {
    initializeTree(track);
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {rootNode ? (
        <TrackTreeNode spotifyApi={spotifyApi} node={rootNode} />
      ) : (
        <div className="w-full max-w-96 p-3" onClick={stopPropagation} onMouseDown={stopPropagation}>
          <SearchTracks spotifyApi={spotifyApi} onSelected={handleSelectInitial} />
        </div>
      )}
    </>
  );
}
