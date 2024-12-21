import TrackTreeNode from "./TrackTreeNode";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "../utils/TrackTreeContext";
import { MapInteractionCSS } from "react-map-interaction";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTree({ spotifyApi }: Props) {
  const { rootNode } = useTrackTree();

  if (!rootNode) return null;

  return (
    <div className="flex grow justify-center items-center overflow-hidden relative z-0">
      <MapInteractionCSS>
        <div className="w-screen h-screen flex justify-center items-center">
          <div
            className="absolute pointer-events-none"
            style={{
              width: "10000px",
              height: "10000px",
              backgroundImage: `radial-gradient(circle, rgba(var(--gray), 0.6) 1.5px, transparent 2px)`,
              backgroundSize: "30px 30px",
            }}
          />
          <TrackTreeNode spotifyApi={spotifyApi} node={rootNode} />
        </div>
      </MapInteractionCSS>
    </div>
  );
}
