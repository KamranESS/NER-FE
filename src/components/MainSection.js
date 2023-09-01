import React, { useState } from "react";
import { Container, Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FileUpload from "./FileUpload";
import FilePreviews from "./FilePreviews";
import Sidebar from "./Sidebar";

const MainSection = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreviews, setShowPreviews] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const totalFiles = uploadedFiles.length;

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
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Container
                maxWidth="100%"
                sx={{
                    backgroundColor: "#0bb6e1",
                    transform: "translateY(-5px)",
                    transition: "transform 0.2s ease",
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
                                // position: "absolute",
                                // top: 5,
                                // right: 5,
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
                            <span style={{ marginRight: "4px", fontSize: "16px", fontWeight: "600" }}>- Total Files: {totalFiles} -</span>
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

                <Container
                    maxWidth="xl"
                    sx={{
                        backgroundColor: "#0bb6e1",
                        minHeight: "80vh",
                        flex: "2",
                    }}
                >
                    <IconButton
                        onClick={handleSidebarToggle}
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 1,
                            backgroundColor: "#fff",
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Sidebar open={isSidebarOpen} onClose={handleSidebarToggle} />
                    <Container maxWidth="xl">
                        {selectedImage && (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Selected"
                                style={{ maxWidth: "350px", maxHeight: "100%" }}
                            />
                        )}
                    </Container>
                </Container>
            </div>
        </>
    );
};

export default MainSection;
