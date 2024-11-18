import { useRef, useEffect, useState } from "react";
import { TreeNode } from "../utils/Types";
import SpotifyWebApi from "spotify-web-api-js";
import { useSpotify } from "../utils/useSpotify";
import { MdOutlineAdd, MdPause, MdPlayArrow, MdRefresh, MdRemove } from "react-icons/md";
import { useTrackTree } from "../utils/TrackTreeContext";
// import { IoMdTrash } from "react-icons/io";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  node: TreeNode<SpotifyApi.TrackObjectFull>;
  depth?: number;
  angle?: number;
  angleSpan?: number;
  radius?: number;
  radiusStep?: number;
}

interface NodePosition {
  x: number;
  y: number;
  angle: number;
}

export default function TrackTreeNode({
  spotifyApi,
  node,
  depth = 0,
  angle = 0,
  angleSpan = 360,
  radius = 0,
  radiusStep = 300,
}: Props) {
  const { deselectNode, selectNode } = useTrackTree();
  const { getRecommendations, reload } = useSpotify(spotifyApi);
  const [position, setPosition] = useState<NodePosition>({ x: 0, y: 0, angle: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Convert angle to radians and calculate position
    const angleInRadians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);
    setPosition({ x, y, angle });
  }, [angle, radius]);

  const handleClick = async () => {
    await getRecommendations(node, node.children.length > 0 ? 1 : Math.max(3 - depth, 1));
  };

  const handleDeselect = (e: React.MouseEvent) => {
    e.stopPropagation();
    deselectNode(node);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node);
  };

  const handleReload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await reload(node);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } else {
      if (node.value.preview_url) {
        const audio = new Audio(node.value.preview_url);
        audio.loop = true;
        audioRef.current = audio;
        audio.play();
      }
    }
    setIsPlaying((prev) => !prev);
  };

  // Calculate child positions
  const childCount = node.children.length;
  const childAngleStep = childCount > 0 ? angleSpan / childCount : 0;
  const startAngle = angle - angleSpan / 2;

  return (
    <div
      className="absolute hover:z-10"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.5s ease-out",
      }}
    >
      {/* Connection lines to children */}
      {node.children.map((_, index) => {
        const childAngle = startAngle + childAngleStep * (index + 0.5);
        const childAngleRad = (childAngle * Math.PI) / 180;
        const childX = radiusStep * Math.cos(childAngleRad);
        const childY = radiusStep * Math.sin(childAngleRad);
        const lineLength = Math.sqrt(childX * childX + childY * childY);
        const lineAngle = childAngle % 360;

        return (
          <div
            key={`line-${index}`}
            className="absolute origin-left border-t-2 border-dashed transition-all"
            style={{
              width: lineLength,
              transform: `rotate(${lineAngle}deg)`,
              transformOrigin: "center left",
            }}
          />
        );
      })}

      {/* Node content */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 p-2 flex flex-row justify-start items-start gap-2 select-none bg-glass backdrop-blur-md transition-all duration-300 overflow-hidden cursor-pointer ${
          node.selected && "border-foreground"
        }`}
        style={{
          transform: `translate(-50%, -50%)`,
        }}
        onClick={handleClick}
      >
        <div className="flex flex-col gap-2">
          <img className="w-36 h-36 bg-lighter" src={node.value.album?.images[0].url} alt={node.value.album?.images[0].url} />
          <div className="w-36 flex flex-col gap-1">
            <div className="whitespace-nowrap text-ellipsis overflow-hidden">{node.value.name}</div>
            <div className="opacity-60 whitespace-nowrap text-ellipsis overflow-hidden">
              {node.value.artists[0].name}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 transition-all w-6">
          <button className="p-1 rounded-full duration-300 bg-light hover:bg-medium" onClick={handlePlay}>
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </button>
          {node.selected ? (
            <button className="p-1 rounded-full duration-300 bg-light hover:bg-medium" onClick={handleDeselect}>
              <MdRemove />
            </button>
          ) : (
            <button className="p-1 rounded-full duration-300 bg-light hover:bg-medium" onClick={handleSelect}>
              <MdOutlineAdd />
            </button>
          )}
          <button className="p-1 rounded-full duration-300 bg-light hover:bg-medium" onClick={handleReload}>
            <MdRefresh />
          </button>
          {/* <button className="p-1 rounded-full duration-300 bg-light hover:bg-medium" onClick={handleDelete}>
            <IoMdTrash />
          </button> */}
        </div>
      </div>

      {/* Child nodes */}
      {node.children.map((child, index) => (
        <TrackTreeNode
          key={index}
          spotifyApi={spotifyApi}
          node={child}
          depth={depth + 1}
          angle={startAngle + childAngleStep * (index + 0.5)}
          angleSpan={childAngleStep}
          radius={radiusStep}
          radiusStep={radiusStep}
        />
      ))}
    </div>
  );
}
