import { useEffect, useState } from "react";
import { TreeNode } from "../utils/Types";
import SpotifyWebApi from "spotify-web-api-js";
import { useSpotify } from "../utils/useSpotify";
import { MdOutlineAdd, MdPause, MdPlayArrow, MdRefresh, MdRemove } from "react-icons/md";
import { useTrackTree } from "../utils/TrackTreeContext";
import { IoMdTrash } from "react-icons/io";
import { RiAsterisk } from "react-icons/ri";
import { useAudioPlayer } from "../utils/AudioPlayerContext";

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
  const { deselectNode, selectNode, deleteNode } = useTrackTree();
  const { getRecommendations, reload } = useSpotify(spotifyApi);
  const [position, setPosition] = useState<NodePosition>({ x: 0, y: 0, angle: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const { currentTrack, isPlaying: _isPlaying, playAudio, pauseAudio, checkSubTree } = useAudioPlayer();

  useEffect(() => {
    // Convert angle to radians and calculate position
    const angleInRadians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);
    setPosition({ x, y, angle });
  }, [angle, radius]);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) pauseAudio();
    else playAudio(node.value);
  };

  const handleGetRecommendations = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await getRecommendations(node, node.children.length > 0 ? 1 : Math.max(4 - depth, 1));
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node);
  };

  const handleDeselect = (e: React.MouseEvent) => {
    e.stopPropagation();
    deselectNode(node);
  };

  const handleReload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkSubTree(node)) pauseAudio();
    await reload(node);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkSubTree(node)) pauseAudio();
    deleteNode(node);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setIsPlaying(currentTrack === node.value && _isPlaying);
  }, [currentTrack, _isPlaying]);

  // Calculate child positions
  const childCount = node.children.length;
  const childAngleStep = childCount > 0 ? angleSpan / childCount : 0;
  const startAngle = angle - angleSpan / 2;

  return (
    <div
      className="absolute hover:z-10"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
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
            className="absolute origin-left border-t-2 border-dashed backdrop-blur"
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
        className={`absolute p-3 flex flex-row justify-start items-start gap-3 select-none bg-lightGlass rounded-lg backdrop-blur-md duration-100 overflow-hidden ${
          node.selected && "border-2 border-foreground"
        }`}
        style={{
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="flex flex-col gap-3">
          <img
            className="w-36 h-36 bg-lighter pointer-events-none"
            src={node.value.album?.images[0].url}
            alt={node.value.album?.images[0].url}
          />
          <div className="w-36 flex flex-col">
            <div className="whitespace-nowrap text-ellipsis overflow-hidden leading-[1.25]">{node.value.name}</div>
            <div className="whitespace-nowrap text-ellipsis overflow-hidden leading-[1.25] opacity-60">
              {node.value.artists[0].name}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className={`p-1.5 rounded-full duration-300 bg-lighter ${
              isPlaying ? "bg-light" : "hover:bg-light"
            }`}
            onClick={handlePlay}
            onDoubleClick={handleClick}
          >
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </button>
          <button
            className="p-1.5 rounded-full duration-300 bg-lighter hover:bg-light"
            onClick={handleGetRecommendations}
            onDoubleClick={handleClick}
          >
            <RiAsterisk />
          </button>
          {node.selected ? (
            <button
              className="p-1.5 rounded-full duration-300 bg-lighter hover:bg-light"
              onClick={handleDeselect}
              onDoubleClick={handleClick}
            >
              <MdRemove />
            </button>
          ) : (
            <button
              className="p-1.5 rounded-full duration-300 bg-lighter hover:bg-light"
              onClick={handleSelect}
              onDoubleClick={handleClick}
            >
              <MdOutlineAdd />
            </button>
          )}
          <button
            className="p-1.5 rounded-full duration-300 bg-lighter hover:bg-light"
            onClick={handleReload}
            onDoubleClick={handleClick}
          >
            <MdRefresh />
          </button>
          <button
            className="p-1.5 rounded-full duration-300 bg-lighter hover:bg-light"
            onClick={handleDelete}
            onDoubleClick={handleClick}
          >
            <IoMdTrash />
          </button>
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
