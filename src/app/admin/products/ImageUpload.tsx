import React, { useState } from "react";
import { Box, Button, Input } from "@mui/material";
import axios from "axios";

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:3001/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Box>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload Image
      </Button>
    </Box>
  );
};

export default ImageUpload;
