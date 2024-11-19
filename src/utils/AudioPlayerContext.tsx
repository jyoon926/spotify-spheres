import React, { createContext, useContext, useState, useRef } from "react";

type AudioPlayerContextType = {
  currentTrack: SpotifyApi.TrackObjectFull | null;
  playAudio: (track: SpotifyApi.TrackObjectFull) => void;
  pauseAudio: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      }
    }, 10);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      setCurrentTrack(null);
      audioRef.current.pause();
    }
  };

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, playAudio, pauseAudio }}>
      {children}
      <div
        className={`fixed right-3 flex flex-col gap-2 p-3 border-2 bg-glass backdrop-blur-lg duration-300 ${
          currentTrack ? "bottom-3" : "bottom-[-80px]"
        }`}
      >
        <p className="opacity-60 italic">Now playing:</p>
        <div className="flex flex-row items-center gap-3">
          <img className="w-12 h-12" src={currentTrack?.album.images[0].url} />
          <div className="w-36 flex flex-col">
            <p className="whitespace-nowrap text-ellipsis overflow-hidden leading-[1.25] ">{currentTrack?.name}</p>
            <p className="whitespace-nowrap text-ellipsis overflow-hidden leading-[1.25] opacity-60">
              {currentTrack?.artists[0].name}
            </p>
          </div>
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
