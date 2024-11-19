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
      <div className="w-[400px] h-[400px]">
        <TransformWrapper initialScale={10} minScale={5} maxScale={20} centerOnInit={true} wheel={{ step: 2, smoothStep: 0.01 }}>
          {({ centerView }) => (
            <Fragment>
              <TransformComponent>
                <div className="flex w-full justify-center items-center scale-[.1]">
                  <div
                    className="absolute"
                    style={{
                      width: "10000px",
                      height: "10000px",
                      backgroundImage: `radial-gradient(circle, rgba(var(--foreground), 0.2) 1px, transparent 1px)`,
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <TrackTree spotifyApi={spotifyApi} />
                </div>
              </TransformComponent>
              <div className="fixed top-2 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => centerView(10)}
                  className="button light sm transition-all duration-200 ease-in-out"
                >
                  Reset view
                </button>
              </div>
            </Fragment>
          )}
        </TransformWrapper>
      </div>
      <TrackList spotifyApi={spotifyApi} />
    </TrackTreeProvider>
  );
}
