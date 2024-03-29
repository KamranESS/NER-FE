import React from "react";
import {
  Paper,
  ImageList,
  ImageListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/custom-scrollbar.css";

const FilePreviews = ({ uploadedFiles, onDeleteImage, onSelectImage, selectedImage }) => {
  return (
    <Paper sx={{ backgroundColor: "#333333" }}>
      <ImageList cols={2} gap={10}>
        {uploadedFiles.map((file, index) => (
          <ImageListItem
            key={index}
            onClick={() => onSelectImage(index)}
            style={{
              border: uploadedFiles[index] === selectedImage ? "4px solid #0bb6e1" : "none",
              cursor: "pointer", // Added cursor style for clickable effect
            }}
          >
            <img src={URL.createObjectURL(file)} alt={file.name} />
            <IconButton
              color="primary"
              aria-label="Delete"
              onClick={() => onDeleteImage(index)}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <DeleteIcon />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  );
};

export default FilePreviews;
