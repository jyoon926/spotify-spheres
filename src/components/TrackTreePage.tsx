import SpotifyWebApi from "spotify-web-api-js";
import TrackTree from "./TrackTree";
import { TrackTreeProvider } from "../utils/TrackTreeContext";
import TrackList from "./TrackList";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Fragment } from "react/jsx-runtime";
import { AudioPlayerProvider } from "../utils/AudioPlayerContext";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTreePage({ spotifyApi }: Props) {
  return (
    <TrackTreeProvider>
      <AudioPlayerProvider>
        <div className="absolute inset-0">
          <TransformWrapper initialScale={1} minScale={0.3} maxScale={2} centerOnInit={true}>
            {({ centerView }) => (
              <Fragment>
                <TransformComponent>
                  <TrackTree spotifyApi={spotifyApi} />
                </TransformComponent>
                <div className="fixed top-3 left-1/2 -translate-x-1/2">
                  <button
                    onClick={() => centerView(1)}
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
      </AudioPlayerProvider>
    </TrackTreeProvider>
  );
}
