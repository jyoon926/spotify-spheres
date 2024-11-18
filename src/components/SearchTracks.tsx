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
  const [debouncedQuery] = useDebounce(query, 300);

  // Debounce search to avoid too many API calls
  const searchTracks = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      spotifyApi
        .searchTracks(searchQuery, { limit: 5 })
        .then((data) => {
          setResults(data.tracks.items);
          setLoading(false);
        })
        .catch((error) => {
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

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim()) {
      setLoading(true);
    } else {
      setResults([]);
      setLoading(false);
    }
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-3">
        <input
          className="w-80"
          type="text"
          placeholder="Search for a song"
          value={query}
          onChange={handleQueryChange}
        />
        <div className={`spinner ${!loading && "opacity-0"}`} />
      </div>
      {results.length > 0 && (
        <div className="flex flex-col gap-3 border-2 bg-glass backdrop-blur-md p-3">
          {results.map((result) => (
            <button
              className="flex flex-row justify-start items-center gap-3"
              key={result.id}
              onClick={() => onSelected(result)}
            >
              <div
                className="w-10 h-10 bg-cover"
                style={{
                  backgroundImage: `url(${result.album?.images[0].url})`,
                }}
              />
              <div className="flex flex-col justify-start items-start">
                <div className="leading-[1.1] whitespace-nowrap text-ellipsis overflow-hidden w-64 text-left">{result.name}</div>
                <div className="leading-[1.1] whitespace-nowrap text-ellipsis overflow-hidden w-64 text-left opacity-60">
                  {result.artists[0].name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
