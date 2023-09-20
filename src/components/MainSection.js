import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, IconButton, Button } from "@mui/material";
import FileUpload from "./FileUpload";
import FilePreviews from "./FilePreviews";
import Sidebar from "./Sidebar";
import FloatingToolbar from "./FloatingToolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import nerImage from "../assets/NER.png";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";

const MainSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [showPreviews, setShowPreviews] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [selectedRectangleIndex, setSelectedRectangleIndex] = useState(null);
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Track selected image index
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [generatedLabels, setGeneratedLabels] = useState([]);
  

  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);



  useEffect(() => {
    if (selectedImageSrc) {
      const image = new window.Image();
      image.src = selectedImageSrc;
      image.onload = () => {
        imageRef.current = image;
      };
    }
  }, [selectedImageSrc]);

  useEffect(() => {
    if (selectedImageSrc) {
      // Check if a new image is selected
      if (isNewImageSelected) {
        // Display a confirmation dialog
        const confirmMessage =
          "Changing the image will remove existing labels. Do you want to proceed?";
        const userConfirmed = window.confirm(confirmMessage);

        if (!userConfirmed) {
          // User canceled the image change
          return;
        }
      }

      // Load the selected image
      const image = new window.Image();
      image.src = selectedImageSrc;
      image.onload = () => {
        imageRef.current = image;

        // Calculate initial position to center the image
        const stage = stageRef.current;
        const stageWidth = stage.width();
        const stageHeight = stage.height();
        const imageWidth = image.width;
        const imageHeight = image.height;
        const initialX = (stageWidth - imageWidth * zoomLevel) / 2;
        const initialY = (stageHeight - imageHeight * zoomLevel) / 2;

        const layer = layerRef.current;
        layer.destroyChildren(); // Clear the layer
        const imageNode = new window.Konva.Image({
          image: image,
          x: initialX,
          y: initialY,
          scaleX: zoomLevel,
          scaleY: zoomLevel,
          draggable: !isLocked,
        });

        layer.add(imageNode);

        // Render rectangles after the image
        rectangles.forEach((rect, index) => {
          layer.add(
            new window.Konva.Rect({
              ...rect,
              stroke:
                selectedRectangleIndex === index ? "red" : "red",
              strokeWidth: 3,
              draggable: !isLocked,
            })
          );
        });

        layer.batchDraw();
        setIsNewImageSelected(false); // Reset the flag after loading the image
      };
    }
  }, [selectedImageSrc, zoomLevel, rectangles, isNewImageSelected]);

  const handleFilesSelect = (files) => {
    const imageFiles = files.filter((file) => {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      return validImageTypes.includes(file.type);
    });

    if (isNewImageSelected || rectangles.length === 0) {
      // If a new image is selected or no rectangles are present, proceed without confirmation
      setUploadedFiles(imageFiles);
      setSelectedImageSrc(URL.createObjectURL(imageFiles[0]));
      setShowPreviews(true);
      setRectangles([]);
      setIsNewImageSelected(false);
    } else {
      // Show a confirmation alert
      const confirmChange = window.confirm(
        "Changing the image will discard your current annotations. Do you want to proceed?"
      );

      if (confirmChange) {
        // User clicked "Proceed"
        setUploadedFiles(imageFiles);
        setSelectedImageSrc(URL.createObjectURL(imageFiles[0]));
        setShowPreviews(true);
        setRectangles([]);
        setIsNewImageSelected(false);
      }
      // If the user clicks "Cancel," do nothing
    }
  };

  const handleDeleteImage = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const handleImageSelect = (index) => {
    setSelectedImageSrc(URL.createObjectURL(uploadedFiles[index]))
    setSelectedImageIndex(index); 
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

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedRectangleIndex(null);
      setDrawing(true);
      const stage = stageRef.current;
      const scale = stage.scaleX();
      const pointerPos = stage.getPointerPosition();
      const x = (pointerPos.x - stage.x()) / scale;
      const y = (pointerPos.y - stage.y()) / scale;
      setStartPoint({ x, y });
      setRectangles([...rectangles, { x, y, width: 0, height: 0 }]);
      return;
    }

    const clickedRect = e.target;
    const index = rectangles.indexOf(clickedRect);
    setSelectedRectangleIndex(index);
  };

  const handleMouseMove = (e) => {
    if (!drawing) {
      return;
    }

    const x = e.evt.layerX / zoomLevel;
    const y = e.evt.layerY / zoomLevel;

    const lastIndex = rectangles.length - 1;
    const width = x - rectangles[lastIndex].x;
    const height = y - rectangles[lastIndex].y;

    const updatedRectangles = [...rectangles];
    updatedRectangles[lastIndex] = {
      x: rectangles[lastIndex].x,
      y: rectangles[lastIndex].y,
      width,
      height,
    };

    setRectangles(updatedRectangles);
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
    }
  };

  const addRectangle = () => {

    // Create the new rectangle object
    const newRectangle = {
      x: 50,
      y: 50,
      width: 100,
      height: 20,
    };

    // Update the rectangles state
    setRectangles([...rectangles]);
  };

  const handleMouseDown = (e) => {
    if (!isLocked) {
      const stage = stageRef.current;
      const scale = stage.scaleX();
      const pointerPos = stage.getPointerPosition();
      const x = (pointerPos.x - stage.x()) / scale; // Adjust the size as needed
      const y = (pointerPos.y - stage.y()) / scale; // Adjust the size as needed

      const newRectangle = {
        x: x,
        y: y,
        width: 100,
        height: 20,
      };

      setRectangles([...rectangles, newRectangle]);
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <Container
        maxWidth="100%"
        sx={{
          backgroundColor: "#333333",
          transition: "transform 0.2s ease",
          borderBottom: "2px solid black",
          display: "flex",
          justifyContent: "space-between", // Align buttons to the right
          alignItems: "center",
        }}
      >
        <Box
          maxWidth="xl"
          sx={{
            backgroundColor: "#333333",
            padding: "8px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={nerImage} alt="NER Logo" />
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LockOpenIcon />}
            sx={{ marginRight: 1, color: "white" }}
          >
            Signup
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LockIcon />}
            sx={{ backgroundColor: "white", color: "#333333" }}
          >
            Login
          </Button>
        </Box>
      </Container>
      <div
        style={{
          backgroundColor: "#333333",
          minHeight: "90vh",
          display: "flex",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "#333333",
            minHeight: "80vh",
            // flex: "1",
            display: "flex",
            width: "30%",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Container
            className="scrollbar-container"
            sx={{
              backgroundColor: "#28231D",
              minHeight: "65vh",
              maxHeight: "65vh",
              borderRadius: "6px",
              overflowY: "auto",
              // marginTop: "1rem",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                color: "#28231D",
                padding: "2px 4px",
                borderRadius: "4px",
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
              selectedImage={selectedImageSrc}
              selectedImageIndex={selectedImageIndex}
            />
          </Container>
          <Container
            sx={{
              backgroundColor: "#28231D",
              // minHeight: "18vh",
              maxHeight: "18vh",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
              marginTop: "0.5rem",
            }}
          >
            <FileUpload onFilesSelect={handleFilesSelect} />
          </Container>
        </Container>

        <div
          style={{
            backgroundColor: "#28231D",
            minHeight: "80vh",
            // flex: "2",
            display: "flex",
            flexDirection: "row",
            width: "70%",
          }}
        >
          <div>
            <Container
              sx={{
                backgroundColor: "#333333",
                minHeight: "8vh",
                width: "40%",
                borderRadius: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "0.25rem",
                marginBottom: "0.25rem",
              }}
            >
              <IconButton onClick={toggleLock} sx={{ color: "white" }}>
                {isLocked ? <LockIcon /> : <LockOpenIcon />}
              </IconButton>
              <FloatingToolbar
                onZoomInClick={handleZoomIn}
                onZoomOutClick={handleZoomOut}
                onAddRectangle={addRectangle}
                isLocked={!isLocked}
                generatedLabels={generatedLabels} // Pass the generated labels as a prop
              />
            </Container>
            <TransformWrapper
              options={{
                limitToBounds: false,
              }}
              disabled={isLocked} // Disable TransformWrapper when locked
            >
              <TransformComponent>
                <Stage
                  width={window.innerWidth * 0.50}
                  height={window.innerHeight * 0.82}
                  ref={stageRef}
                  onMouseDown={handleStageMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  <Layer ref={layerRef} onClick={handleMouseDown}>
                    {/* Render your selected image */}
                    {selectedImageSrc && (
                      <Image
                        image={imageRef.current}
                        maxWidth="350px"
                        maxHeight="100%"
                        draggable={!isLocked}
                        scaleX={zoomLevel}
                        scaleY={zoomLevel}
                      />
                    )}

                    {/* Render rectangles */}
                    {rectangles.map((rect, index) => (
                      <Rect
                        key={index}
                        {...rect}
                        stroke={selectedRectangleIndex === index ? "red" : "blue"}
                        strokeWidth={2}
                        draggable={!isLocked}
                        onDrag={(e) => {
                          const newRectangles = rectangles.slice();
                          newRectangles[index] = {
                            ...newRectangles[index],
                            x: e.target.x(),
                            y: e.target.y(),
                          };
                          setRectangles(newRectangles);
                        }}
                        onClick={() => {
                          setSelectedRectangleIndex(index);
                        }}
                      />
                    ))}

                    {/* Transformer for the selected rectangle */}
                    {selectedRectangleIndex !== null && (
                      <Transformer
                        selectedShapeIndex={selectedRectangleIndex}
                        setSelectedShapeIndex={setSelectedRectangleIndex}
                      />
                    )}
                  </Layer>
                  {/* <Layer onClick={handleMouseDown}></Layer> */}
                </Stage>


              </TransformComponent>
            </TransformWrapper>
          </div>
          <div
            className="scrollbar-container1"
            style={{
              backgroundColor: "#333333",
              maxHeight: "91vh",
              width: "20vw",
              overflowY: "auto",
            }}
          >
            <Sidebar onLabelsGenerated={setGeneratedLabels} />
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
          borderTop: "2px solid black"
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
            ANNOTATION APP COPYRIGHTS © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </DndProvider>
  );
};

export default MainSection;
