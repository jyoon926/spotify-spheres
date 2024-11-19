import SpotifyWebApi from "spotify-web-api-js";
import TrackTree from "./TrackTree";
import { TrackTreeProvider } from "../utils/TrackTreeContext";
import TrackList from "./TrackList";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Fragment } from "react/jsx-runtime";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTreePage({ spotifyApi }: Props) {
  return (
    <TrackTreeProvider>
      <TransformWrapper initialScale={1} limitToBounds={false} minScale={0.25} maxScale={1.5} centerOnInit={true}>
        {({ resetTransform }) => (
          <Fragment>
            <TransformComponent>
              <div className="w-screen h-screen flex justify-center items-center">
                <div
                  className="absolute"
                  style={{
                    width: "10000%",
                    height: "10000%",
                    backgroundImage: `radial-gradient(circle, rgba(var(--foreground), 0.2) 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                />
                <TrackTree spotifyApi={spotifyApi} />
              </div>
            </TransformComponent>
            <div className="fixed top-2 left-1/2 -translate-x-1/2">
              <button
                onClick={() => resetTransform()}
                className="button light sm transition-all duration-200 ease-in-out"
              >
                Reset view
              </button>
            </div>
          </Fragment>
        )}
      </TransformWrapper>
      <TrackList spotifyApi={spotifyApi} />
    </TrackTreeProvider>
  );
}
