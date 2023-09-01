import React from "react";
import { IconButton, Toolbar as MuiToolbar } from "@mui/material";
import { AddBox, ZoomIn, ZoomOut, Undo, Redo } from "@mui/icons-material";

const Toolbar = ({ onRectButtonClick, onZoomInClick, onZoomOutClick, onUndoClick, onRedoClick }) => {
  return (
    <MuiToolbar>
      <IconButton onClick={onRectButtonClick}>
        <AddBox />
      </IconButton>
      <IconButton onClick={onZoomInClick}>
        <ZoomIn />
      </IconButton>
      <IconButton onClick={onZoomOutClick}>
        <ZoomOut />
      </IconButton>
      <IconButton onClick={onUndoClick}>
        <Undo />
      </IconButton>
      <IconButton onClick={onRedoClick}>
        <Redo />
      </IconButton>
    </MuiToolbar>
  );
};

export default Toolbar;
