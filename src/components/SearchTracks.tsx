import { useCallback, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useDebounce } from "use-debounce";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  onSelected: (track: SpotifyApi.TrackObjectFull) => void;
}

export default function SearchTracks({ spotifyApi, onSelected }: Props) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedQuery] = useDebounce(query, 500);

  // Debounce search to avoid too many API calls
  const searchTracks = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      spotifyApi.searchTracks(searchQuery, { limit: 5 }).then((data) => {
        setResults(data.tracks.items);
        setLoading(false);
      }).catch((error) => {
        console.error("Error searching tracks:", error);
        setResults([]);
        setLoading(false);
      });
    },
    [spotifyApi]
  );

  useEffect(() => {
    searchTracks(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center">
        <input
          className="w-80"
          type="text"
          placeholder="Search for a song"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={`spinner ${!loading && "opacity-0"}`} />
      </div>
      {results.map((result) => (
        <button className="flex flex-row justify-start items-center gap-3" key={result.id} onClick={() => onSelected(result)}>
          <div
            className="w-10 h-10 bg-cover"
            style={{
              backgroundImage: `url(${result.album?.images[0].url})`,
            }}
          />
          <div className="flex flex-col justify-start items-start w-64">
            <div className="leading-[1.1] whitespace-nowrap text-ellipsis overflow-x-hidden">{result.name}</div>
            <div className="leading-[1.1] whitespace-nowrap text-ellipsis overflow-x-hidden opacity-60">{result.artists[0].name}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
