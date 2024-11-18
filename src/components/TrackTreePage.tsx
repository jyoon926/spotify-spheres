import SpotifyWebApi from "spotify-web-api-js";
import TrackTree from "./TrackTree";
import DraggableContainer from "./DraggableContainer";
import { TrackTreeProvider } from "../utils/TrackTreeContext";
import TrackList from "./TrackList";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTreePage({ spotifyApi }: Props) {
  return (
    <TrackTreeProvider>
      <DraggableContainer>
        <TrackTree spotifyApi={spotifyApi} />
      </DraggableContainer>
      <TrackList spotifyApi={spotifyApi} />
    </TrackTreeProvider>
  );
}
