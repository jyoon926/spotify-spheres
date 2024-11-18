import { useEffect, useState } from "react";
import TrackTreeNode from "./TrackTreeNode";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "../utils/TrackTreeContext";
import SearchTracks from "./SearchTracks";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTree({ spotifyApi }: Props) {
  const { rootNode, initializeTree } = useTrackTree();
  const [initializing, setInitializing] = useState(false);

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       spotifyApi.getMyTopTracks({ limit: 1, time_range: "medium_term" }, async function (_, data) {
  //         initializeTree(data.items[0]);
  //         setInitializing(false);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching top tracks:", error);
  //     }
  //   };

  //   if (!rootNode && !initializing) {
  //     setInitializing(true);
  //     initialize();
  //   }
  // }, [initializeTree, initializing, rootNode, spotifyApi]);

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
        <div className="absolute" onClick={stopPropagation} onMouseDown={stopPropagation}>
          <SearchTracks spotifyApi={spotifyApi} onSelected={handleSelectInitial} />
        </div>
      )}
    </>
  );
}
