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
    <div className="flex flex-col gap-2 w-full">
      <div className="flex grow flex-row items-center gap-3">
        <input
          className="grow"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleQueryChange}
        />
      </div>
      {(results.length > 0 || loading) && (
        <div className="flex grow flex-col gap-3 bg-lightGlass rounded-lg backdrop-blur-lg p-3">
          {loading && <div className="spinner" />}
          {results.map((result) => (
            <button
              className="flex grow flex-row justify-start items-center gap-3"
              key={result.id}
              onClick={() => onSelected(result)}
            >
              <img className="w-12 h-12 bg-lighter" src={result.album?.images[0].url} alt={result.album?.images[0].url} />
              <div className="flex grow flex-col justify-start items-start">
                <div className="w-[210px] leading-[1.25] whitespace-nowrap text-ellipsis overflow-x-hidden text-left">{result.name}</div>
                <div className="w-[210px] leading-[1.25] whitespace-nowrap text-ellipsis overflow-x-hidden text-left opacity-60">
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
