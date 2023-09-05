import React, { useState } from "react";
import { Container, Typography, Box, IconButton } from "@mui/material";
import FileUpload from "./FileUpload";
import FilePreviews from "./FilePreviews";
import Sidebar from "./Sidebar";
import FloatingToolbar from "./FloatingToolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const MainSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreviews, setShowPreviews] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false);

  const handleFilesSelect = (files) => {
    const imageFiles = files.filter((file) => {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      return validImageTypes.includes(file.type);
    });

    setUploadedFiles(imageFiles);
    setSelectedImage(imageFiles[0]);
    setShowPreviews(true);
  };

  const handleDeleteImage = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const handleImageSelect = (index) => {
    setSelectedImage(uploadedFiles[index]);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.2);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.2);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container
        maxWidth="100%"
        sx={{
          backgroundColor: "#0bb6e1",
          transition: "transform 0.2s ease",
          borderBottom: "4px solid #242124",
        }}
      >
        <Box
          maxWidth="xl"
          sx={{
            backgroundColor: "#0bb6e1",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
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
      <div
        style={{
          backgroundColor: "#242124",
          minHeight: "90vh",
          display: "flex",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "#242124",
            minHeight: "80vh",
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Container
            className="scrollbar-container"
            sx={{
              backgroundColor: "#333333",
              minHeight: "65vh",
              maxHeight: "65vh",
              borderRadius: "6px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#0bb6e1",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <span
                style={{
                  marginRight: "4px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                - Total Files: {uploadedFiles.length} -
              </span>
            </div>
            <FilePreviews
              uploadedFiles={uploadedFiles}
              onDeleteImage={handleDeleteImage}
              onSelectImage={handleImageSelect}
              selectedImage={selectedImage}
            />
          </Container>
          <Container
            sx={{
              backgroundColor: "#0bb6e1",
              minHeight: "20vh",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <FileUpload onFilesSelect={handleFilesSelect} />
          </Container>
        </Container>

        <div
          style={{
            backgroundColor: "#0bb6e1",
            minHeight: "80vh",
            flex: "2",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <Container
              sx={{
                backgroundColor: "#333333",
                minHeight: "8vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton onClick={toggleLock} sx={{ color: "#fff" }}>
                {isLocked ? <LockIcon /> : <LockOpenIcon />}
              </IconButton>
              <FloatingToolbar
                onZoomInClick={handleZoomIn}
                onZoomOutClick={handleZoomOut}
              />
            </Container>
            <TransformWrapper
              options={{
                limitToBounds: false,
                pan: !isLocked,
                pinch: !isLocked,
              }}
            >
              <TransformComponent>
                <div
                  style={{
                    minHeight: "82vh",
                    width: "45vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {selectedImage && (
                    <div
                      className={isLocked ? "locked-image" : "draggable-image"}
                    >
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          transform: `scale(${zoomLevel})`,
                          transition: "transform 0.1s ease",
                          maxWidth: "300px",
                          maxHeight: "100%",
                        }}
                      />
                    </div>
                  )}
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div
            className="scrollbar-container1"
            style={{
              backgroundColor: "#fff",
              maxHeight: "90vh",
              width: "20vw",
              borderLeft: "4px solid #333333",
              overflowY: "auto",
            }}
          >
            <Sidebar />
          </div>
        </div>
      </div>
      <Container
        maxWidth="100%"
        sx={{
          backgroundColor: "#333333",
          transition: "transform 0.2s ease",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          maxWidth="xl"
          sx={{
            backgroundColor: "#333333",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            component="h1"
            sx={{ fontWeight: "bold", color: "#fff" }}
          >
            ANNOTATION APP COPYRIGHTS © 2023
          </Typography>
        </Box>
      </Container>
    </DndProvider>
  );
};

export default MainSection;
