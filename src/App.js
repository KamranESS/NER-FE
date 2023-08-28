import React, { useState } from "react";
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import FileUpload from "./components/FileUpload";
import FilePreviews from "./components/FilePreviews";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPreviews, setShowPreviews] = useState(false);

  const handleFilesSelect = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setUploadedFiles(imageFiles);
    setShowPreviews(true);
  };

  const handleDeleteImage = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          textAlign: "center",
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: "#222",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#0bb6e1",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            borderRadius: "6px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "#fff" }}
          >
            NER.
          </Typography>
        </Box>
      </Container>
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: "#242124",
          minHeight: "90vh",
          // padding: "20px 0",
          display: "flex",
          gap: 2,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            backgroundColor: "#242124",
            // borderRadius: "20px",
            // padding: "20px",
            // flex: "1 1 auto",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#0bb6e1",
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <FileUpload onFilesSelect={handleFilesSelect} />
          </Box>
          <FilePreviews
            uploadedFiles={uploadedFiles}
            onDeleteImage={handleDeleteImage}
          />
        </Container>
        <Container
          maxWidth="xl"
          sx={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "20px",
            flex: "1 1 auto",
          }}
        >
          <Typography variant="subtitle1" component="p" sx={{ color: "red" }}>
            Note: Only image files (jpeg, png, gif) are allowed. Test 
          </Typography>
        </Container>
      </Container>
    </>
  );
}

export default App;
