import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Crop75Icon from '@mui/icons-material/Crop75';

const FloatingToolbar = ({ onAddRectangle, onZoomInClick, onZoomOutClick, isLocked, generatedLabels }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLabelSelect = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={onAddRectangle} disabled={isLocked} sx={{ color: "white" }}>
        <Crop75Icon />
      </IconButton>
      <IconButton onClick={onZoomInClick} sx={{ color: "white" }}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={onZoomOutClick} sx={{ color: "white" }}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton onClick={handleLabelSelect} sx={{ color: "white" }}>
        Label
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {generatedLabels.map((label, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {label.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FloatingToolbar;
