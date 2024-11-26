import TrackTreeNode from "./TrackTreeNode";
import SpotifyWebApi from "spotify-web-api-js";
import { useTrackTree } from "../utils/TrackTreeContext";
import { useEffect, useRef, useState } from "react";

interface Props {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

export default function TrackTree({ spotifyApi }: Props) {
  const { rootNode } = useTrackTree();
  const divRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [shiftX, setShiftX] = useState<number>(0);
  const [shiftY, setShiftY] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    setTimeout(() => {
      if (!divRef.current) return;
      const div: HTMLDivElement = divRef.current;
      if (div.children) {
        const { x, y } = div.getBoundingClientRect();
        let left = x;
        let right = x;
        let top = y;
        let bottom = y;
        let children = Array.from(div.children);
        while (children.length > 0) {
          const curr = children.shift()!;
          const currRect = curr.getBoundingClientRect();
          if (currRect.left < left) left = currRect.left;
          if (currRect.right > right) right = currRect.right;
          if (currRect.top < top) top = currRect.top;
          if (currRect.bottom > bottom) bottom = currRect.bottom;
          if (curr.children) children.push(...Array.from(curr.children));
        }
        setWidth(right - left);
        setHeight(bottom - top);
        setShiftX(((right + left) / 2 - x) * -1);
        setShiftY(((top + bottom) / 2 - y) * -1);
      }
    });
  }, [rootNode]);

  useEffect(() => {
    const rootElement = wrapperRef.current;
    if (!rootElement) return;
    const parentElement = rootElement.parentElement;
    if (!parentElement) return;

    const updateScale = () => {
      const transform = getComputedStyle(parentElement).transform;
      if (transform && transform !== "none") {
        const matrix = new DOMMatrix(transform);
        setScale(matrix.a);
      } else {
        setScale(1);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    resizeObserver.observe(parentElement);
    updateScale();
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!rootNode) return null;
  return (
    <div
      className="flex justify-center items-center"
      style={{ width: width / scale + 400 + "px", height: height / scale + 400 + "px", transform: `translateX(${shiftX / scale}px) translateY(${shiftY / scale}px)` }}
      ref={wrapperRef}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: "10000px",
          height: "10000px",
          backgroundImage: `radial-gradient(circle, rgba(var(--gray), 0.6) 1.5px, transparent 2px)`,
          backgroundSize: "30px 30px",
        }}
      />
      <div ref={divRef}>
        <TrackTreeNode spotifyApi={spotifyApi} node={rootNode} />
      </div>
    </div>
  );
}
