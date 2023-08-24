import React, { useCallback, useState } from "react";
import { Paper, Typography, Box, Snackbar } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const allowedImageFormats = ["image/jpeg", "image/png", "image/gif"];

const FileUpload = ({ onFilesSelect }) => {
  const [showWarning, setShowWarning] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const nonImageFiles = acceptedFiles.filter(
        (file) => !allowedImageFormats.includes(file.type)
      );
      if (nonImageFiles.length > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
        onFilesSelect(acceptedFiles);
      }
    },
    [onFilesSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: allowedImageFormats.join(","),
    multiple: true,
  });

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  return (
    <Box sx={{ marginTop: "5rem" }}>
      <Paper
        // variant="outlined"
        elevation={9}
        sx={{
          padding: "20px",
          //   height: "20vh",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: "#fff",
          color: "black",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "#0797b8",
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" />
        <Typography variant="subtitle1" component="p">
          Drop image files here or click to select
        </Typography>
      </Paper>
      <Snackbar
        open={showWarning}
        autoHideDuration={5000}
        onClose={handleCloseWarning}
        message="Only image files (jpeg, png, gif) are allowed."
      />
    </Box>
  );
};

export default FileUpload;
