import React from "react";
import {
  Paper,
  Typography,
  ImageList,
  ImageListItem,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FilePreviews = ({ uploadedFiles, onDeleteImage }) => {
  return (
    <Paper>
      <Typography variant="h6" gutterBottom>
        Uploaded Files Preview:
      </Typography>
      <ImageList cols={4} gap={10}>
        {uploadedFiles.map((file, index) => (
          <ImageListItem key={index}>
            <img src={URL.createObjectURL(file)} alt={file.name} />
            <IconButton
              color="secondary"
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
