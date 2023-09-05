import React, { useState } from "react";
import {
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

const Sidebar = () => {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [duplicateAlert, setDuplicateAlert] = useState(false);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleNewLabelChange = (event) => {
    setNewLabel(event.target.value);
  };

  const handleAddNewLabel = () => {
    if (newLabel) {
      if (labels.some((label) => label.label === newLabel)) {
        setDuplicateAlert(true);
      } else {
        const randomColor = getRandomColor();
        const updatedLabels = [...labels, { label: newLabel, color: randomColor }];
        setLabels(updatedLabels);
        setNewLabel("");
      }
    }
  };

  const handleDeleteLabel = (label) => {
    const updatedLabels = labels.filter((l) => l !== label);
    setLabels(updatedLabels);
  };

  const handleCloseDuplicateAlert = () => {
    setDuplicateAlert(false);
  };
  return (
    <>
      <List>
        <Typography variant="h6" sx={{ marginLeft: 2, marginBottom: 2 }}>
          Labels
        </Typography>
        {labels.map((label, index) => (
          <ListItem key={index} disablePadding sx={{borderBottom: "1px solid #ddd" }}>
            <ListItemIcon>
              <span
                style={{
                  backgroundColor: label.color,
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "inline-block",
                  marginLeft: "1.5rem",
                }}
              />
            </ListItemIcon>
            <ListItemText primary={label.label} />
            <IconButton
              edge="end"
              onClick={() => handleDeleteLabel(label)}
              aria-label="delete"
              sx={{ marginRight: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <TextField
            variant="outlined"
            label="New Label"
            value={newLabel}
            onChange={handleNewLabelChange}
            sx={{ marginRight: 3, width: "50%",marginTop: 2, marginLeft: "1.5rem",}}
          />
          <Button variant="contained" onClick={handleAddNewLabel} sx={{ marginTop: 2,}}>
            Add
          </Button>
        </ListItem>
      </List>
      <Snackbar
        open={duplicateAlert}
        autoHideDuration={6000}
        onClose={handleCloseDuplicateAlert}
      >
        <Alert severity="error" onClose={handleCloseDuplicateAlert}>
          Label already exists!
        </Alert>
      </Snackbar>
    </>
  )
}

export default Sidebar