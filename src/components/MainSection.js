import React, { useState } from "react";
import { Container, Typography, Box, } from '@mui/material'
import FileUpload from "./FileUpload";
import FilePreviews from "./FilePreviews";

const MainSection = () => {
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
                    backgroundColor: "#0bb6e1",
                    // boxShadow: "0px 8px 12px rgba(0, 0, 0, 1)",
                    // marginBottom: "20px",
                    // border: "1px solid #ddd",
                    transform: "translateY(-5px)", // Adding 3D effect
                    transition: "transform 0.2s ease",
                }}
            ><Box
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
                </Box></Container>
            <div
                style={{
                    backgroundColor: "#242124",
                    minHeight: "90vh",
                    display: "flex",
                    // gap: "2rem",
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
                        gap: 1, // Allow it to grow and take 30% of the width
                    }}
                >
                    <Container
                        sx={{
                            backgroundColor: "#333333",
                            minHeight: "65vh",
                            maxHeight: "65vh",
                            // New push
                            // padding: "10px 20px",
                            // display: "flex",
                            borderRadius: "6px",
                            overflowY: "auto",
                        }}><FilePreviews
                            uploadedFiles={uploadedFiles}
                            onDeleteImage={handleDeleteImage}
                        /></Container>
                    <Container
                        sx={{
                            backgroundColor: "#0bb6e1",
                            minHeight: "20vh",
                            padding: "10px 20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "6px",
                        }}><FileUpload onFilesSelect={handleFilesSelect} /></Container>
                </Container>
                <Container
                    maxWidth="xl"
                    sx={{
                        backgroundColor: "#0bb6e1",
                        minHeight: "80vh",
                        flex: "2", // Allow it to grow and take 70% of the width
                    }}
                ></Container>
            </div>
        </>
    )
}

export default MainSection