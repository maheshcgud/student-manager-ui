import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { useEffect } from 'react';

//import studentData from "./studentsData.json";

//console.log("studentData", studentData);

function EditToolbar(props) {
  const { setRows, setRowModesModel} = props;
 

  const handleClick = () => {
    const id = studentData.length + 1;
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        studentNumber: "",
        studentFullName: "",
        cellphoneNumber: "",
        emailAddress: "",
        currentScore: "",
        averageScore: "",
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "studentNumber" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid(props) {
  const [rows, setRows] = React.useState(props.studentData);
  console.log('studentData', props.studentData);

  const [selectedStudentId, setSelectedStudentId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [newScore, setNewScore] = React.useState("");

  useEffect(() => {
    setRows(props.studentData || []);
  }, [props.studentData]); 

  const handleAddScoreClick = (id) => () => {
    setSelectedStudentId(id);
    setOpen(true);
  };

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
      try {
          await axios.delete(`http://localhost:8081/students/${id}`);
          
          // Update state after successful deletion
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          
          console.log(`Student with ID ${id} deleted successfully`);
      } catch (error) {
          console.error("Error deleting student:", error);
      }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    // const updatedRow = { ...newRow, isNew: false };
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    // return updatedRow;
    try {
      // Send PUT request to update student details in the backend
      console.log("studentData of newRow", newRow);
      const response = await axios.put(`http://localhost:8081/students/${newRow.id}`, newRow);
  
      // Check if the update was successful
      if (response.status === 200) {
        const updatedRow = { ...newRow, isNew: false };
        setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      } else {
        throw new Error("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student details. Please try again.");
      return newRow; // Return previous row state if update fails
    }

  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Handle Score Submission
  const handleScoreSubmit = async () => {
    if (newScore === "" || isNaN(newScore) || newScore < 0 || newScore > 100) {
      alert("Please enter a valid score between 0 and 100");
      return;
    }

    try {
      //const scoreAsDouble = parseFloat(newScore);
      //console.log("scoreAsDouble",scoreAsDouble);
      // Send POST request to add new score
      const response = await axios.post(`http://localhost:8081/scores/${selectedStudentId}?score=${newScore}`);

      if (response.status === 200 || response.status === 201) {
        alert("Score added successfully!");

        // Fetch updated student data
        const updatedStudent = await axios.get(`http://localhost:8081/students/${selectedStudentId}`);

        // Update the rows with the new score
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedStudentId ? { ...updatedStudent.data } : row
          )
        );
      }
    } catch (error) {
      console.error("Error adding score:", error);
      alert("Failed to add score. Please try again.");
    }

    setOpen(false);
    setNewScore("");
  };

  const columns = [
    {
      field: "studentNumber",
      headerName: "Student Number",
      width: 180,
      editable: false,
    },
    {
      field: "studentFullName",
      headerName: "Student Name",
      type: "text",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "cellphoneNumber",
      headerName: "Cell Number",
      type: "text",
      width: 180,
      editable: true,
      preProcessEditCellProps: (params) => {
        const isValid = /^\+?[1-9]\d{1,14}$/.test(params.props.value); 
        return { ...params.props, error: !isValid };
      },
    },
    {
      field: "emailAddress",
      headerName: "E-mail",
      width: 200,
      editable: true,
      type: "emailAddress",
    },
    {
      field: "currentScore",
      headerName: "Current Score",
      width: 120,
      editable: false,
    },
    {
      field: "averageScore",
      headerName: "Avgrage Score",
      width: 120,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          // <Chip icon={<AddIcon />} label="Add Score" />,
          <GridActionsCellItem
            icon={<AddIcon />}
            label="Add Score"
            onClick={handleAddScoreClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        key={rows.length}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
        slots={{ toolbar: GridToolbar }}
      />

      {/* Dialog to Add Score */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Score</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Score"
            type="number"
            fullWidth
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            inputMode="decimal"
            pattern="[0-9]+([.][0-9]+)?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleScoreSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
