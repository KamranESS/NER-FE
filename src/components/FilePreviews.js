import React from "react";
import {
  Paper,
  ImageList,
  ImageListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/custom-scrollbar.css";

const FilePreviews = ({ uploadedFiles, onDeleteImage, onSelectImage }) => {
  return (
    <Paper sx={{ backgroundColor: "#333333" }}>
      <ImageList cols={2} gap={10}>
        {uploadedFiles.map((file, index) => (
          <ImageListItem
          key={index}
          onClick={() => onSelectImage(index)} // Select image on click
          style={{
            border: file === onSelectImage ? "10px solid red" : "none", // Highlight selected image
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
