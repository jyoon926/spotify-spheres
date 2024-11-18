import React, { useRef, useState, useCallback, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface DraggableContainerProps {
  children: React.ReactNode;
  className?: string;
  showResetButton?: boolean;
  minZoom?: number;
  maxZoom?: number;
  onPositionChange?: (position: Position) => void;
  onZoomChange?: (zoom: number) => void;
}

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  children,
  className = "",
  showResetButton = true,
  minZoom = 0.25,
  maxZoom = 2,
  onPositionChange,
  onZoomChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPinchDistance = useRef<number | null>(null);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (lastPinchDistance.current !== null) return; // Don't start drag during pinch
      setIsDragging(true);
      setStartPos({
        x: clientX - position.x,
        y: clientY - position.y,
      });
    },
    [position]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || lastPinchDistance.current !== null) return;

      const newPosition = {
        x: clientX - startPos.x,
        y: clientY - startPos.y,
      };

      setPosition(newPosition);
      onPositionChange?.(newPosition);
    },
    [isDragging, startPos, onPositionChange]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    lastPinchDistance.current = null;
  }, []);

  const handleZoom = useCallback(
    (deltaY: number, clientX?: number, clientY?: number) => {
      const zoomSpeed = 0.001;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * (1 - deltaY * zoomSpeed)));

      if (clientX !== undefined && clientY !== undefined && containerRef.current) {
        // Get container bounds
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate position relative to container center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate zoom origin relative to current position
        const zoomOriginX = clientX - centerX - position.x;
        const zoomOriginY = clientY - centerY - position.y;

        // Calculate new position to maintain zoom origin
        const scaleFactor = newZoom / zoom;
        const newPosition = {
          x: position.x - zoomOriginX * (scaleFactor - 1),
          y: position.y - zoomOriginY * (scaleFactor - 1),
        };

        setPosition(newPosition);
        onPositionChange?.(newPosition);
      }

      setZoom(newZoom);
      onZoomChange?.(newZoom);
    },
    [zoom, position, minZoom, maxZoom, onPositionChange, onZoomChange]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      handleZoom(e.deltaY, e.clientX, e.clientY);
    },
    [handleZoom]
  );

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Initialize pinch zoom
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastPinchDistance.current = distance;
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      }
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastPinchDistance.current !== null) {
        // Handle pinch zoom
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const delta = lastPinchDistance.current - distance;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        handleZoom(delta, midX, midY);
        lastPinchDistance.current = distance;
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove, handleZoom]
  );

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    onPositionChange?.({ x: 0, y: 0 });
    onZoomChange?.(1);
  }, [onPositionChange, onZoomChange]);

  // Clean up event listeners
  useEffect(() => {
    const handleWindowMouseUp = () => handleEnd();
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [handleEnd]);

  const isAtDefault = position.x === 0 && position.y === 0 && zoom === 1;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden relative flex justify-center items-center ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <div
        className="relative w-screen h-screen flex justify-center items-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        <div
          className="absolute"
          style={{
            width: "1000%",
            height: "1000%",
            backgroundImage: `radial-gradient(circle, rgba(var(--foreground), 0.2) 1px, transparent 1px)`,
            backgroundSize: "25px 25px",
          }}
        />
        {children}
      </div>

      <div
        className={`fixed left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center duration-300 ${
          showResetButton && !isAtDefault ? "top-3" : "-top-10"
        }`}
      >
        <button onClick={resetPosition} className="button light sm transition-all duration-200 ease-in-out">
          Reset view
        </button>
      </div>
    </div>
  );
};

export default DraggableContainer;
