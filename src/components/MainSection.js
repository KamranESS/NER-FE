import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, IconButton, Snackbar, Alert, Button, Tooltip } from "@mui/material";
import FileUpload from "./FileUpload";
import FilePreviews from "./FilePreviews";
import Sidebar from "./Sidebar";
import FloatingToolbar from "./FloatingToolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LockIcon from "@mui/icons-material/Lock";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import LockOpenIcon from "@mui/icons-material/LockOpen";
// import Tooltip from "@mui/material/Tooltip";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Track selected image index
  const [generatedLabels, setGeneratedLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [labelRectMap, setLabelRectMap] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [tempRect, setTempRect] = useState(null); // To store the temporary rectangle being drawn
  const [initialImagePosition, setInitialImagePosition] = useState({ x: 0, y: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const imageElementRef = useRef(null);

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
          // draggable: !isLocked,
        });

        layer.add(imageNode);

        // Render rectangles after the image
        rectangles.forEach((rect, index) => {
          const labelObj = generatedLabels.find((labelObj) => labelObj.label === rect.label);
          const strokeColor = labelObj ? labelObj.color : "red";

          layer.add(
            new window.Konva.Rect({
              ...rect,
              stroke: selectedRectangleIndex === index ? "red" : strokeColor,
              strokeWidth: 1,
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

  const toggleLock = () => {
    setIsLocked(!isLocked);
    console.log(isLocked); // Check the value of isLocked
  };

  const doesRectangleExist = (label) => {
    return rectangles.some((rect) => rect.label === label);
  };

  const addRectangle = () => {
    if (selectedLabel) {
      if (!labelRectMap[selectedLabel]) {
        const labelObj = generatedLabels.find((labelObj) => labelObj.label === selectedLabel);

        if (labelObj) {
          const color = labelObj.color;

          if (!doesRectangleExist(selectedLabel)) {
            const newRectangle = {
              x: 150,
              y: 150,
              width: 100,
              height: 20,
              label: labelObj.label,
              stroke: color,
              strokeWidth: 1,
            };

            setLabelRectMap({
              ...labelRectMap,
              [selectedLabel]: newRectangle,
            });
          } else {
            // Show a message that a rectangle with the same label already exists
            alert(`A rectangle with the label "${selectedLabel}" already exists.`);
          }
        }
      }
    }
  };

  const handleLabelChange = (updatedLabels) => {
    // Update the labels in the parent component
    setGeneratedLabels(updatedLabels);
  };

  const handleStageMouseDown = (e) => {
    if (isLocked && selectedLabel) {
      const labelExists = doesRectangleExist(selectedLabel); // Check if rectangle with label exists
      if (!labelExists) {
        setDrawing(true);
        const stage = stageRef.current;
        const pointer = stage.getPointerPosition();
        setStartPoint({
          x: pointer.x,
          y: pointer.y,
        });

        const labelObj = generatedLabels.find(
          (labelObj) => labelObj.label === selectedLabel
        );

        if (labelObj) {
          const color = labelObj.color;
          setTempRect({
            x: pointer.x,
            y: pointer.y,
            width: 0,
            height: 0,
            label: selectedLabel,
            stroke: color,
            strokeWidth: 1,
          });
        }
      } else {
        // Show a Snackbar message that a rectangle with the same label already exists
        setSnackbarMessage(`A rectangle with the label "${selectedLabel}" already exists.`);
        setSnackbarOpen(true);
      }
    }
  };


  const handleMouseUp = () => {
    if (tempRect) {
      const updatedRectangles = [...rectangles];
      updatedRectangles.push(tempRect);
      setRectangles(updatedRectangles);
      setTempRect(null);
      setDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      const width = pointer.x - startPoint.x;
      const height = pointer.y - startPoint.y;

      setTempRect((prevTempRect) => ({
        ...prevTempRect,
        width: width,
        height: height,
      }));
    }
  };

  const generateAndDownloadYOLOData = () => {
    const yoloData = Object.values(labelRectMap).map((rect) => {
      const x = (rect.x + rect.width / 2) / imageRef.current.width; // Calculate x center relative to image width
      const y = (rect.y + rect.height / 2) / imageRef.current.height; // Calculate y center relative to image height
      const width = rect.width / imageRef.current.width; // Calculate width relative to image width
      const height = rect.height / imageRef.current.height; // Calculate height relative to image height

      return `${rect.label} ${x} ${y} ${width} ${height}`;
    });

    // Combine YOLO data into a single string
    const yoloText = yoloData.join('\n');

    // Create a Blob with the YOLO data
    const blob = new Blob([yoloText], { type: 'text/plain' });

    // Create a download link for the Blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'annotations.txt'; // Set the desired file name

    // Add the download link to the DOM and trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);

    // Generate an image with rectangles overlaid
    const stage = stageRef.current;
    const layer = layerRef.current;
    stage.toDataURL({
      callback: function (dataUrl) {
        // Create a download link for the image
        const imgA = document.createElement('a');
        imgA.href = dataUrl;
        imgA.download = 'annotated_image.png'; // Set the desired image file name
        imgA.style.display = 'none';
        document.body.appendChild(imgA);
        imgA.click();
        document.body.removeChild(imgA);
      },
    });
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
                width: "35%",
                borderRadius: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "0.25rem",
                marginBottom: "0.25rem",
              }}
            >
              <Tooltip title="Lock Layout">
                <IconButton onClick={toggleLock} sx={{ color: "white" }}>
                  {isLocked ? <LockIcon /> : <LockOpenIcon />}
                </IconButton>
              </Tooltip>
              <FloatingToolbar
                // onZoomInClick={handleZoomIn}
                // onZoomOutClick={handleZoomOut}
                onAddRectangle={addRectangle}
                isLocked={!isLocked}
                onLabelsGenerated={handleLabelChange} // Pass the label change handler function
                generatedLabels={generatedLabels} // Pass the generated labels as a prop
                selectedLabel={selectedLabel} // Pass the selectedLabel state
                setSelectedLabel={setSelectedLabel} // Pass the setSelectedLabel function
              />
              {/* <Button onClick={generateAndDownloadYOLOData}>Generate Annotations</Button> */}
              <Tooltip title="Generate Annotations">
                <IconButton onClick={generateAndDownloadYOLOData} sx={{ color: "white" }}>
                  <DownloadForOfflineIcon />
                </IconButton>
              </Tooltip>
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
                  <Layer ref={layerRef}>
                    {selectedImageSrc && (
                      <Image
                        image={imageElementRef.current}
                        maxWidth="350px"
                        maxHeight="100%"
                        scaleX={zoomLevel}
                        scaleY={zoomLevel}
                        // draggable={!isLocked}
                        x={initialImagePosition.x}
                        y={initialImagePosition.y}
                      />
                    )}

                    {rectangles.map((rect, index) => (
                      <Rect
                        key={index}
                        {...rect}
                        strokeWidth={rect.strokeWidth}
                        stroke={rect.stroke}
                        draggable
                        onDrag={(e) => {
                          const newRectangles = [...rectangles];
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

                    {tempRect && (
                      <Rect
                        {...tempRect}
                        strokeWidth={tempRect.strokeWidth}
                        stroke={tempRect.stroke}
                      />
                    )}

                    {selectedRectangleIndex !== null && (
                      <Transformer
                        selectedShapeIndex={selectedRectangleIndex}
                        setSelectedShapeIndex={setSelectedRectangleIndex}
                      />
                    )}
                  </Layer>
                </Stage>
              </TransformComponent>
            </TransformWrapper>
            {/* <Button onClick={generateAndDownloadYOLOData}>Generate YOLO Data</Button> */}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Adjust the duration as needed
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </DndProvider>
  );
};

export default MainSection;
