import React from "react";
import {IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Crop75Icon from '@mui/icons-material/Crop75';
import HandIcon from '@mui/icons-material/PanTool';

const FloatingToolbar = ({ onEditClick, onZoomInClick, onZoomOutClick, isEditMode }) => {
  return (
    <>
      <IconButton onClick={onEditClick} sx={{ color: "#fff" }}>
        <Crop75Icon />
      </IconButton>
      <IconButton onClick={onZoomInClick} sx={{ color: "#fff" }}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={onZoomOutClick} sx={{ color: "#fff" }}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton onClick={isEditMode} sx={{ color: "#fff" }}>
        <HandIcon />
      </IconButton>
    </>
  );
};

export default FloatingToolbar;
