import { useAuth } from "../utils/AuthContext";
import TrackTreePage from "../components/TrackTreePage";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { AudioPlayerProvider } from "../utils/AudioPlayerContext";
import { TrackTreeProvider } from "../utils/TrackTreeContext";

export default function Home() {
  const { login, isAuthenticated, loading, token } = useAuth();
  const [spotifyApi, setSpotifyApi] = useState<SpotifyWebApi.SpotifyWebApiJs | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      const spotify = new SpotifyWebApi();
      spotify.setAccessToken(token);
      setSpotifyApi(spotify);
    } else {
      setSpotifyApi(null);
    }
  }, [isAuthenticated, token]);

  if (loading) return null;

  return (
    <div>
      {spotifyApi ? (
        <TrackTreeProvider>
          <AudioPlayerProvider>
            <TrackTreePage spotifyApi={spotifyApi} />
          </AudioPlayerProvider>
        </TrackTreeProvider>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-10 p-5">
          <h1 className="max-w-[700px] text-center text-4xl sm:text-5xl md:text-6xl">
            Discover music and explore your taste like never before.
          </h1>
          <button className="button text-lg" onClick={login}>
            Start exploring
          </button>
        </div>
      )}
    </div>
  );
}
