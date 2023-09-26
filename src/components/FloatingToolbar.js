import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Button, Select, Tooltip } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Crop75Icon from '@mui/icons-material/Crop75';

const FloatingToolbar = ({ onAddRectangle, onZoomInClick, onZoomOutClick, isLocked, generatedLabels, onLabelsGenerated, selectedLabel, setSelectedLabel }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  // const [selectedLabel, setSelectedLabel] = useState("");

  const handleLabelSelect = (event) => {
    // Handle label selection and pass the selected label to the parent component
    const selectedLabel = event.target.value;
    setSelectedLabel(selectedLabel);
  };

  return (
    <>
      <Tooltip title="Add Rectangle">
        <IconButton
          sx={{ color: "white" }}
          aria-label="Add Rectangle"
          onClick={onAddRectangle}
          disabled={isLocked}
        >
          <Crop75Icon />
        </IconButton>
      </Tooltip>
      {/* <Tooltip title="Zoom In">
        <IconButton
          sx={{ color: "white" }}
          aria-label="Zoom In"
          onClick={onZoomInClick}
        >
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton
          sx={{ color: "white" }}
          aria-label="Zoom Out"
          onClick={onZoomOutClick}
        >
          <ZoomOutIcon />
        </IconButton>
      </Tooltip> */}
      <Select
        value={selectedLabel}
        onChange={handleLabelSelect}
        displayEmpty
        inputProps={{ "aria-label": "Select Label" }}
        style={{ marginLeft: "10px", color: "white", padding: 0, height: "35px", width: "76px", border: "none", }}
      >
        <MenuItem value="" disabled style={{fontSize: "15px"}}>
          Select Label
        </MenuItem>
        {generatedLabels.map((labelObj) => (
          <MenuItem key={labelObj.label} value={labelObj.label} style={{ color: labelObj.color }}>
            {labelObj.label}
          </MenuItem>
        ))}
      </Select>
      {/* <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "10px" }}
        disabled={!selectedLabel || isLocked}
      >
        Apply
      </Button> */}
    </>
  );
};

export default FloatingToolbar;
