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
  MenuItem,
  Select,
} from "@mui/material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FormControl, InputLabel } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getBreeds } from "app/apis/chicken_api";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useContext } from "react";
import AuthContext from "app/contexts/JWTAuthContext";
import {
  addHatcherRecord,
  deleteHatcherRecord,
  getHatcherRecord,
  getHatcherRecords,
  updateHatcherRecordInAPI,
} from "app/apis/hatchery_unit_api";
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

const ViewHactheryRecord = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    id: 0,
    breed_of_chicken: 0,
    number_of_eggs_set: 0,
    date_of_set: new Date().toISOString().split("T")[0],
    hour_of_set: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date_of_candling: new Date().toISOString().split("T")[0],
    date_of_transfer: new Date().toISOString().split("T")[0],
    collector: user.id,
  };

  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hatcheryRecord, setHatcheryRecord] = useState([]);
  const [hatcheryRecords, setHatcheryRecords] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [breeds, setBreeds] = useState([]);

  // const [hatcheryRecords, setHatcheryRecords] = useState([]);
  const [filteredHatcheryRecordsForUser, setFilteredHatcheryRecordsForUser] = useState([]);
  
  useEffect(() => {
    const fetchHatcheryRecords = async () => {
      try {
        const hatcheryData = await getHatcherRecords();
        setHatcheryRecords(hatcheryData);
      } catch (error) {
        console.error("Error fetching hatcheryRecords:", error);
      }
    };
    fetchHatcheryRecords();
  }, [add, del, edit]);
  
  useEffect(() => {
    if (user.role === 'USER') {
      const filteredData = hatcheryRecords.filter(item => item.collector === user.id);
      setFilteredHatcheryRecordsForUser(filteredData);
    } else {
      setFilteredHatcheryRecordsForUser(hatcheryRecords);
    }
  }, [hatcheryRecords, user]);
  
  const handleDeleteHatcheryRecords = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hatchery records?"
    );

    if (confirmed) {
      try {
        await deleteHatcherRecord(id);
        setDelete((prev) => !prev);
      } catch (error) {
        console.error("Failed to delete the records:", error);
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
  const updateHatcheryRecords = async (id) => {
    setEdit(true);
    try {
      const response = await getHatcherRecord(id);
      setHatcheryRecord(response);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addHatcherRecord(formData);
      setAdd(false);
    } catch (error) {
      console.error("Error adding records:", error);
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
    setHatcheryRecord({
      ...hatcheryRecord,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateHatcheryRecord = async (e) => {
    e.preventDefault();
    try {
      await updateHatcherRecordInAPI(hatcheryRecord.id, hatcheryRecord);
      setEdit(false);
      setAdd(false);
    } catch (error) {
      console.error("Error updating records:", error);
    }
  };
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsData = await getBreeds();
        setBreeds(breedsData);
      } catch (error) {
        console.error("Error fetching Breeds:", error);
      }
    };
    fetchBreeds();
  }, [add, edit]);
  const getBreedDetails = (id) => {
    const breed = breeds.find((b) => b.id === id);
    return breed ? `${breed.name}` : "Unknown Breed";
  };
  const handleDownLoad = () => {
    const fetchHatcheryRecords = async () => {
      try {
        const housesData = await getHatcherRecords();
        const csvData = jsonToCsv(housesData);
        downloadCsv(csvData, "hatcheryrecords.csv");
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchHatcheryRecords();
  };

  const jsonToCsv = (jsonData) => {
    const keys = Object.keys(jsonData[0]);
    const csvRows = jsonData.map((row) =>
      keys.map((key) => JSON.stringify(row[key], null, "")).join(",")
    );

    csvRows.unshift(keys.join(","));
    return csvRows.join("\n");
  };

  const downloadCsv = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filterrecords = filteredHatcheryRecordsForUser.filter((record) =>
    String(record.id).toLowerCase().includes(searchQuery.toLowerCase())
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
                      label="Search by ID"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      name="search"
                      value={searchQuery}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center">Breed</TableCell>
                <TableCell align="center">Egg Set</TableCell>
                <TableCell align="center">Date of Set</TableCell>
                <TableCell align="center">Date of Candling</TableCell>
                <TableCell align="center">Date of Transfer</TableCell>
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
              {filterrecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{record.id}</TableCell>
                    <TableCell align="center">
                      {getBreedDetails(record.breed_of_chicken)}
                    </TableCell>
                    <TableCell align="center">
                      {record.number_of_eggs_set}
                    </TableCell>
                    <TableCell align="center">{record.date_of_set}</TableCell>
                    <TableCell align="center">
                      {record.date_of_candling}
                    </TableCell>
                    <TableCell align="center">
                      {record.date_of_transfer}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => updateHatcheryRecords(record.id)}
                          sx={{ "&:hover": { bgcolor: "grey.200" } }}
                        >
                          <EditIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                      {user.role !== "USER" && (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              handleDeleteHatcheryRecords(record.id)
                            }
                            sx={{ "&:hover": { bgcolor: "grey.200" } }}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    
                    {user.role !== "USER" ? (
                                        <TableCell align="center"></TableCell>) : (null)}
                  </TableRow>
                ))}
            </TableBody>
          </StyledTable>

          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={filterrecords.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </>
      ) : edit === true && add === false ? (
        <ValidatorForm
          onSubmit={handleUpdateHatcheryRecord}
          onError={() => null}
        >
          <Grid container spacing={6}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="text"
                name="id"
                label="ID"
                onChange={handleChangeEdit}
                value={hatcheryRecord.id}
                InputProps={{
                  readOnly: true,
                }}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              {/* <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Breed</InputLabel>
                <Select
                  labelId="breed-label"
                  name="breed_of_chicken"
                  value={hatcheryRecord.breed_of_chicken}
                  onChange={handleChangeEdit}
                  label="Breed"
                  required
                >
                  {breeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {breed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
{/* import { Autocomplete, TextField, FormControl } from '@mui/material'; */}

{/* // Your existing state and effect hooks */}

<FormControl variant="outlined" fullWidth>
    <Autocomplete
        options={breeds}
        getOptionLabel={(breed) => breed.name}
        renderInput={(params) => (
            <TextField 
                {...params} // Spreads the necessary props from Autocomplete
                label="Breed" // Sets the label for the TextField
                variant="outlined" // Applies the outlined style to the TextField
            />
        )}
        value={breeds.find(breed => breed.id === hatcheryRecord.breed_of_chicken) || null}
        onChange={(event, newValue) => {
            handleChangeEdit({ target: { name: 'breed_of_chicken', value: newValue ? newValue.id : '' } });
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
    />
</FormControl>

              
              <br />
              <br />
              <TextField
                type="number"
                name="number_of_eggs_set"
                label="Egg Set"
                onChange={handleChangeEdit}
                value={hatcheryRecord.number_of_eggs_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date_of_set"
                label="Date of Set"
                onChange={handleChangeEdit}
                value={hatcheryRecord.date_of_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="time"
                name="hour_of_set"
                label="Hour Set"
                onChange={handleChangeEdit}
                value={hatcheryRecord.hour_of_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="Date"
                name="date_of_candling"
                label="Date of Candling"
                onChange={handleChangeEdit}
                value={hatcheryRecord.date_of_candling}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date_of_transfer"
                label="Date of Transfer"
                onChange={handleChangeEdit}
                value={hatcheryRecord.date_of_transfer}
                validators={["required"]}
                errorMessages={["This field is required"]}
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
          <Grid container spacing={6}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              {/* <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Breed</InputLabel>
                <Select
                  labelId="breed-label"
                  name="breed_of_chicken"
                  value={formData.breed_of_chicken}
                  onChange={handleChange}
                  label="Breed"
                  required
                >
                  {breeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {breed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

<FormControl variant="outlined" fullWidth>
  <Autocomplete
    options={breeds}  // Array of breeds
    getOptionLabel={(option) => `ID : ${option.id} Name: ${option.name}`}  // Display breed name
    onChange={(event, value) => {
      setFormData({
        ...formData,
        breed_of_chicken: value?.id || "",  // Update the breed_of_chicken with selected breed's ID
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Breed"
        variant="outlined"
        required
      />
    )}
  />
</FormControl>

              
              <br />
              <br />
              <TextField
                type="number"
                name="number_of_eggs_set"
                label="Egg Set"
                onChange={handleChange}
                value={formData.number_of_eggs_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date_of_set"
                label="Date of Set"
                onChange={handleChange}
                value={formData.date_of_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="time"
                name="hour_of_set"
                label="Hour Set"
                onChange={handleChange}
                value={formData.hour_of_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="Date"
                name="date_of_candling"
                label="Date of Candling"
                onChange={handleChange}
                value={formData.date_of_candling}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date_of_transfer"
                label="Date of Transfer"
                onChange={handleChange}
                value={formData.date_of_transfer}
                validators={["required"]}
                errorMessages={["This field is required"]}
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
export default ViewHactheryRecord;
