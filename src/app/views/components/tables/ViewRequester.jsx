import React, { useState, useEffect } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  Button,
  Grid,
  styled,
  Tooltip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { addRequester, getRequester,getRequesters, updateRequesterInAPI , deleteRequester} from "app/apis/requester_api";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useContext } from "react";
import AuthContext from "app/contexts/JWTAuthContext";
import { getBreeds, getHouses } from "app/apis/chicken_api";
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const ViewRequester = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    requester_id: "",
    requester_name: "",
    requester_region: "",
    requester_district:"",
    requester_city:"",
    requester_phone_number:"",
    requester_male_count: 0.0,
    requester_female_count: 0.0
  };
  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [requesters, setRequesters] = useState([]);
  const [requester, setRequester] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRequesters = async () => {
        try {
            const requestersData = await getRequesters();
            setRequesters(requestersData);
        } catch (error) {
            console.error("Error fetching requesters:", error);
        }
    };

    fetchRequesters();
}, []);
useEffect(() => {
    const fetchRequesters = async () => {
        try {
            const requestersData = await getRequesters(); // Fetching data from getRequesters
            setRequesters(requestersData); // Update state with the fetched data
        } catch (error) {
            console.error("Error fetching requesters:", error); // Error handling
        }
    };

    fetchRequesters();
}, [add, del, edit]); // Dependencies that trigger re-fetching

  const handleDeleteRequester = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this requester record?"
    );

    if (confirmed) {
      try {
        const response = await deleteRequester(id);  // Make sure this function works
        console.log(response);  // Log the response for debugging
        setDelete((prev) => !prev);
      } catch (error) {
        console.error("Failed to delete the requester record:", error);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const addNew = () => {
    setAdd(true);
    setFormData(initialFormData);
  };
  const updateRequester = async (id) => {
    setEdit(true);
    try {
      const response = await getRequester(id);
      setRequester(response);
    } catch (error) {
      console.error("Error fetching requester:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRequester(formData);
      setAdd(false);
    } catch (error) {
      console.error("Error adding requester:", error);
    }
  };

  const handleBack = () => {
    setAdd(false);
    setEdit(false);
  };
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeEdit = (event) => {
    setRequester({
      ...requester,
      [event.target.name]: event.target.value,
    });
  };


  const handleUpdateRequester = async (e) => {
    e.preventDefault();
    try {
      await updateRequesterInAPI(requester.id, requester);
      setEdit(false);
      setAdd(false);
    } catch (error) {
      console.error("Error updating requester:", error);
    }
  };

  const handleDownLoad = () => {
    const fetchRequesters = async () => {
      try {
        const requesterData = await getRequesters();
        const csvData = jsonToCsv(requesterData);
        downloadCsv(csvData, "requesterdata.csv");
      } catch (error) {
        console.error("Error fetching bodyweight:", error);
      }
    };
    fetchRequesters();
  };

  function jsonToCsv(jsonData) {
    const keys = Object.keys(jsonData[0]);
    const csvRows = jsonData.map((row) =>
      keys.map((key) => JSON.stringify(row[key], null, "")).join(",")
    );

    csvRows.unshift(keys.join(","));
    return csvRows.join("\n");
  }

  function downloadCsv(csvData, filename) {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  
  const filteredrequesters = requesters.filter((requester) =>
      String(requester.requester_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {add === false && edit === false ? (
        <>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <ValidatorForm>
                    <TextValidator
                      label="Requester ID"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      // name="bird_id"
                      value={searchQuery}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Region</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="right">
                  Action | <Button onClick={addNew}>Add New</Button>
                </TableCell>
                {user.role !== "USER" ? (
                  <TableCell align="left">
                    <Button onClick={handleDownLoad}>Download</Button>
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredrequesters
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((requester, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                    {requester.requester_id}
                    </TableCell>
                    <TableCell align="center">{requester.requester_name}</TableCell>
                    <TableCell align="center">{requester.requester_region}</TableCell>
                    <TableCell align="center">{requester.requester_city}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            updateRequester(requester.id);
                          }}
                          sx={{ "&:hover": { bgcolor: "grey.200" } }}
                        >
                          <EditIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                      {user.role !== "USER" ? (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteRequester(requester.id)}
                            sx={{ "&:hover": { bgcolor: "grey.200" } }}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </TableCell>
                    {user.role !== "USER" ? (
                      <TableCell align="center"></TableCell>
                    ) : null}
                  </TableRow>
                ))}
            </TableBody>
          </StyledTable>
          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={filteredrequesters.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </>
      )  : edit === true && add === false ? (
        <ValidatorForm onSubmit={handleUpdateRequester} onError={() => null}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Requester ID"
                onChange={handleChangeEdit}
                name="requester_id"
                value={requester.requester_id}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                label="Requester Name"
                onChange={handleChangeEdit}
                name="requester_name"
                value={requester.requester_name}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                label="Region"
                onChange={handleChangeEdit}
                name="requester_region"
                value={requester.requester_region}
                validators={["required"]}
                errorMessages={["This field is required"]}
                fullWidth
              />
              <TextField
                label="City"
                onChange={handleChangeEdit}
                name="requester_city"
                value={requester.requester_city}
                validators={["required"]}
                errorMessages={["This field is required"]}
                fullWidth
              />

            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

            <TextField
                label="District"
                onChange={handleChangeEdit}
                name="requester_district"
                value={requester.requester_district}
                validators={["required"]}
                errorMessages={["This field is required"]}
                fullWidth
              />

            <TextField
                label="Phone Number"
                onChange={handleChangeEdit}
                name="requester_phone_number"
                value={requester.requester_phone_number}
                validators={["required"]}
                errorMessages={["This field is required"]}
                fullWidth
              />
              <TextField
                label="Male Count"
                onChange={handleChangeEdit}
                name="requester_male_count"
                value={requester.requester_male_count}
                validators={["required"]}
                errorMessages={["This field is required"]}
                fullWidth
                type="number"
              />
                <TextField
                label="Female Count"
                onChange={handleChangeEdit}
                name="requester_female_count"
                value={requester.requester_female_count}
                validators={["required"]}
                errorMessages={["This field is required"]}
                fullWidth
                type="number"
              />
 
            </Grid>
          </Grid>
          <Tooltip title="Back">
            <IconButton
              onClick={handleBack}
              sx={{ bgcolor: "white", "&:hover": { bgcolor: "grey.200" } }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Tooltip>
          &nbsp;&nbsp;&nbsp;
          <Button
            sx={{
              backgroundColor: "#30BA4E",
              "&:hover": {
                backgroundColor: "#28A745",
              },
            }}
            variant="contained"
            type="submit"
          >
            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Update</Span>
          </Button>
        </ValidatorForm>
      ) : (
        <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="text"
                name="requester_id"
                label="Requester id:"
                onChange={handleChange}
                value={formData.requester_id}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="requester_name"
                label="Requester name:"
                onChange={handleChange}
                value={formData.requester_name}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="requester_region"
                label="Requester region:"
                onChange={handleChange}
                value={formData.requester_region}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
                <TextField
                type="text"
                name="requester_district"
                label="Requester district"
                onChange={handleChange}
                value={formData.requester_district}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="text"
                name="requester_city"
                label="Requester city"
                onChange={handleChange}
                value={formData.requester_city}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />
                <TextField
                type="number"
                name="requester_phone_number"
                label="Requester phone number"
                onChange={handleChange}
                value={formData.requester_phone_number}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />
                <TextField
                type="number"
                name="requester_male_count"
                label="Requester male count"
                onChange={handleChange}
                value={formData.requester_male_count}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />
              <TextField
                type="number"
                name="requester_female_count"
                label="Requester female count"
                onChange={handleChange}
                value={formData.requester_female_count}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />

            </Grid>
          </Grid>
          <Tooltip title="Back">
            <IconButton
              onClick={handleBack}
              sx={{ bgcolor: "white", "&:hover": { bgcolor: "grey.200" } }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Tooltip>
          &nbsp;&nbsp;&nbsp;
          <Button
            sx={{
              backgroundColor: "#30BA4E",
              "&:hover": {
                backgroundColor: "#28A745",
              },
            }}
            variant="contained"
            type="submit"
          >
            <Span sx={{ pl: 1, textTransform: "capitalize" }}>
              Save and Continue
            </Span>
          </Button>
        </ValidatorForm>
      )}
    </>
  );
};
export default ViewRequester;
