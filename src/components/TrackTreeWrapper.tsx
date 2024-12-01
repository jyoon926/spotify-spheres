import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Fragment } from "react/jsx-runtime";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "../utils/TrackTreeContext";
import TrackList from "./TrackList";
import TrackTree from "./TrackTree";
import { Sphere } from "../utils/Types";
import { useEffect } from "react";

interface Props {
  sphere: Sphere;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTreeWrapper({ sphere, spotifyApi }: Props) {
  const { initializeTree } = useTrackTree();

  useEffect(() => {
    initializeTree(sphere);
  }, [sphere]);

  return (
    <div>
      <div className="absolute inset-0">
        <TransformWrapper initialScale={1} minScale={0.3} maxScale={2} centerOnInit={true}>
          {({ centerView }) => (
            <Fragment>
              <TransformComponent>
                <TrackTree spotifyApi={spotifyApi} />
              </TransformComponent>
              <div className="fixed bottom-3 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => centerView(1)}
                  className="button light transition-all duration-200 ease-in-out"
                >
                  Reset view
                </button>
              </div>
            </Fragment>
          )}
        </TransformWrapper>
      </div>
      <TrackList spotifyApi={spotifyApi} />
    </div>
  );
}