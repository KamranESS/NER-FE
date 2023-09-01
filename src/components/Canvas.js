import React, { useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

const Canvas = ({ rects, setRects, selectedRectIndex, setSelectedRectIndex, scale, setScale }) => {
  const stageRef = useRef(null);

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedRectIndex(null); // Deselect when clicking on the stage
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      onMouseDown={handleStageMouseDown}
      scaleX={scale}
      scaleY={scale}
    >
      <Layer>
        {rects.map((rect, index) => (
          <Rect
            key={index}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={rect.color}
            draggable
            onDragEnd={(e) => {
              const updatedRects = rects.slice();
              updatedRects[index] = {
                ...updatedRects[index],
                x: e.target.x(),
                y: e.target.y(),
              };
              setRects(updatedRects);
            }}
            onClick={() => setSelectedRectIndex(index)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
