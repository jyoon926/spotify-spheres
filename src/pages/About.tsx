export default function About() {
  return (
    <div className="p-10 flex flex-col gap-10 justify-center items-center absolute inset-0">
      <div className="text-5xl max-w-[800px]">About</div>
      <p className="leading-normal text-center max-w-[700px] text-pretty">
        This project began as a creative experiment with the Spotify Web API, driven by a desire to reimagine music
        discovery. The result? A tree-like interface that transforms your listening experience into an interactive
        journey. Each "sphere" starts with a seed track—your favorite song, a nostalgic tune, or a recent find. From
        there, branches grow into increasingly specific representations of your music tastes. By panning, zooming, and
        adding new nodes, you can intuitively explore related tracks, with each branch reflecting the ancestry of your
        musical journey.
      </p>
    </div>
  );
}
