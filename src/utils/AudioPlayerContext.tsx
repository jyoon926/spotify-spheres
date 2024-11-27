import React, { createContext, useContext, useState, useRef } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { TreeNode } from "./Types";

type AudioPlayerContextType = {
  currentTrack: SpotifyApi.TrackObjectFull | null;
  isPlaying: boolean;
  playAudio: (track: SpotifyApi.TrackObjectFull) => void;
  pauseAudio: () => void;
  checkSubTree: (node: TreeNode<SpotifyApi.TrackObjectFull>) => boolean;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (track: SpotifyApi.TrackObjectFull) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrack(track);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 10);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      setCurrentTrack(null);
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const checkSubTree = (node: TreeNode<SpotifyApi.TrackObjectFull>): boolean => {
    if (node.value === currentTrack) return true;
    for (const child of node.children) {
      if (checkSubTree(child)) {
        return true;
      }
    }
    return false;
  };

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, playAudio, pauseAudio, checkSubTree }}>
      {children}
      <div
        className={`fixed w-full sm:w-auto right-0 p-3 duration-300 ${currentTrack ? "bottom-0" : "bottom-[-100px]"}`}
      >
        <div className="flex min-w-96 flex-row justify-between items-center gap-2 p-3 bg-lightGlass rounded-lg backdrop-blur-lg">
          <div className="flex flex-row items-center gap-3 overflow-hidden">
            {currentTrack ? (
              <a href={currentTrack.album.external_urls.spotify} target="_blank">
                <img className="w-12 h-12 bg-lighter rounded" src={currentTrack.album.images[0].url} />
              </a>
            ) : (
              <div className="w-12 h-12 bg-lighter" />
            )}
            <div className="flex flex-col overflow-hidden">
              <a
                className="whitespace-nowrap text-ellipsis overflow-hidden leading-[1.25] hover:underline"
                href={currentTrack?.external_urls.spotify}
                target="_blank"
              >
                {currentTrack?.name}
              </a>
              <a
                className="whitespace-nowrap text-ellipsis overflow-hidden leading-[1.25] hover:underline opacity-60"
                href={currentTrack?.artists[0].external_urls.spotify}
                target="_blank"
              >
                {currentTrack?.artists[0].name}
              </a>
            </div>
          </div>
          {isPlaying ? (
            <button className="text-3xl p-1" onClick={() => pauseAudio()}>
              <MdPause />
            </button>
          ) : (
            <button className="text-3xl p-1" onClick={() => playAudio(currentTrack!)}>
              <MdPlayArrow />
            </button>
          )}
        </div>
        <audio ref={audioRef} src={currentTrack?.preview_url} loop={true} />
      </div>
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};
