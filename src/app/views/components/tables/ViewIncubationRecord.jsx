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
import { FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getBreeds } from "app/apis/chicken_api";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useContext } from "react";
import AuthContext from "app/contexts/JWTAuthContext";
import {
  addIncubationRecord,
  deleteIncubationRecord,
  getIncubationRecords,
  getIncubationRecord,
  updateIncubationRecordInAPI,
  getHatcherRecords,
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

const ViewIncubationRecord = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    id: 0,
    hatchery_record: 0,
    day: 0,
    incubation_set_temperature: 0,
    egg_shell_temp_min: 0,
    egg_shell_temp_med: 0,
    egg_shell_temp_max: 0,
    humidity_percentage: 0,
    co2_level: 0.0,
    collector: user.id,
    valve_status: "",
    turning: "",
    date: new Date().toISOString().split("T")[0],
  };

  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [incubationRecords, setIncubationRecords] = useState([]);
  const [incubationRecord, setIncubationRecord] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [breeds, setBreeds] = useState([]);
  const [hatcheryRecords, setHatcheryRecords] = useState([]);

  useEffect(() => {
    const fetchIncubationRecords = async () => {
      try {
        const hacheryData = await getIncubationRecords();
        setIncubationRecords(hacheryData);
      } catch (error) {
        console.error("Error fetching fetchIncubationRecords:", error);
      }
    };
    fetchIncubationRecords();
  }, [add, del, edit]);

  useEffect(() => {
    const fetchHatcheryRecords = async () => {
      try {
        const hatcheryData = await getHatcherRecords();
        setHatcheryRecords(hatcheryData);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    fetchHatcheryRecords();
  }, [add, del, edit]);

  const handleDeleteIncubationRecords = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this incubation records?"
    );

    if (confirmed) {
      try {
        await deleteIncubationRecord(id);
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
  const updateIncubationRecords = async (id) => {
    setEdit(true);
    try {
      const response = await getIncubationRecord(id);
      setIncubationRecord(response);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addIncubationRecord(formData);
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
    setIncubationRecord({
      ...incubationRecord,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateIncubationRecord = async (e) => {
    e.preventDefault();
    try {
      await updateIncubationRecordInAPI(incubationRecord.id, incubationRecord);
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
    const fetchIncubationRecords = async () => {
      try {
        const housesData = await getIncubationRecords();
        const csvData = jsonToCsv(housesData);
        downloadCsv(csvData, "incubationrecords.csv");
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchIncubationRecords();
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
  const filterrecords = incubationRecords.filter((record) =>
    String(record.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHatcheryDetails = (id) => {
    const data = hatcheryRecords.find((h) => h.id === id);
    return data
      ? `${getBreedDetails(data.breed_of_chicken)}: ${data.date_of_transfer} `
      : "Unknown House";
  };

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
                      name="id"
                      value={searchQuery}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center">Hatchery</TableCell>
                <TableCell align="center">Day</TableCell>
                <TableCell align="center">I-Temp</TableCell>
                <TableCell align="center">Egg Med Temp</TableCell>
                <TableCell align="center">Humidity</TableCell>
                <TableCell align="center">CO2 Level</TableCell>
                {/* <TableCell align="center">Valve</TableCell>
                <TableCell align="center">Turning</TableCell> */}
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
                      {getHatcheryDetails(record.hatchery_record)}
                    </TableCell>
                    <TableCell align="center">{record.day}</TableCell>
                    <TableCell align="center">
                      {record.incubation_set_temperature}
                    </TableCell>
                    <TableCell align="center">
                      {record.egg_shell_temp_med}
                    </TableCell>
                    <TableCell align="center">
                      {record.humidity_percentage}
                    </TableCell>
                    <TableCell align="center">{record.co2_level}</TableCell>
                    {/* <TableCell align="center">{record.valve_status}</TableCell>
                    <TableCell align="center">{record.turning}</TableCell> */}
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => updateIncubationRecords(record.id)}
                          sx={{ "&:hover": { bgcolor: "grey.200" } }}
                        >
                          <EditIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                      {user.role !== "USER" && (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              handleDeleteIncubationRecords(record.id)
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
          onSubmit={handleUpdateIncubationRecord}
          onError={() => null}
        >
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="text"
                name="id"
                label="ID"
                onChange={handleChangeEdit}
                value={incubationRecord.id}
                InputProps={{
                  readOnly: true,
                }}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Hatchery Record</InputLabel>
                <Select
                  labelId="breed-label"
                  name="hatchery_record"
                  value={incubationRecord.hatchery_record}
                  onChange={handleChangeEdit}
                  label="Hatchery Record"
                  required
                >
                  {hatcheryRecords.map((hatch) => (
                    <MenuItem key={hatch.id} value={hatch.id}>
                      {hatch.id +
                        ": " +
                        getBreedDetails(hatch.breed_of_chicken) +
                        ": " +
                        hatch.date_of_transfer}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />
              <br />
              <TextField
                type="number"
                name="day"
                label="Day"
                onChange={handleChangeEdit}
                value={incubationRecord.day}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="egg_shell_temp_min"
                label="Egg Shell Temp Min"
                onChange={handleChangeEdit}
                value={incubationRecord.egg_shell_temp_min}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="egg_shell_temp_max"
                label="Egg Shell Temp Max"
                onChange={handleChangeEdit}
                value={incubationRecord.egg_shell_temp_max}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="egg_shell_temp_med"
                label="Egg Shell Temp Med"
                onChange={handleChangeEdit}
                value={incubationRecord.egg_shell_temp_med}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="incubation_set_temperature"
                label="Incubation Temperature"
                onChange={handleChangeEdit}
                value={incubationRecord.incubation_set_temperature}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="number"
                name="humidity_percentage"
                label="Humidity %"
                onChange={handleChangeEdit}
                value={incubationRecord.humidity_percentage}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="co2_level"
                label="CO2 Level"
                onChange={handleChangeEdit}
                value={incubationRecord.co2_level}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="valve_status"
                label="Valve Status"
                onChange={handleChangeEdit}
                value={incubationRecord.valve_status}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="turning"
                label="Truning"
                onChange={handleChangeEdit}
                value={incubationRecord.turning}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date"
                label="Date of Record"
                onChange={handleChangeEdit}
                value={incubationRecord.date}
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
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Hatchery Record</InputLabel>
                <Select
                  labelId="breed-label"
                  name="hatchery_record"
                  value={formData.hatchery_record}
                  onChange={handleChange}
                  label="Hatchery Record"
                  required
                >
                  {hatcheryRecords.map((hatch) => (
                    <MenuItem key={hatch.id} value={hatch.id}>
                      {hatch.id +
                        ": " +
                        getBreedDetails(hatch.breed_of_chicken) +
                        ": " +
                        hatch.date_of_transfer}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />
              <br />
              <TextField
                type="number"
                name="day"
                label="Day"
                onChange={handleChange}
                value={formData.day}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="egg_shell_temp_min"
                label="Egg Shell Temp Min"
                onChange={handleChange}
                value={formData.egg_shell_temp_min}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="egg_shell_temp_max"
                label="Egg Shell Temp Max"
                onChange={handleChange}
                value={formData.egg_shell_temp_max}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="egg_shell_temp_med"
                label="Egg Shell Temp Med"
                onChange={handleChange}
                value={formData.egg_shell_temp_med}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="number"
                name="incubation_set_temperature"
                label="Incubation Temperature"
                onChange={handleChange}
                value={formData.incubation_set_temperature}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="humidity_percentage"
                label="Humidity %"
                onChange={handleChange}
                value={formData.humidity_percentage}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="co2_level"
                label="CO2 Level"
                onChange={handleChange}
                value={formData.co2_level}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="valve_status"
                label="Valve Status"
                onChange={handleChange}
                value={formData.valve_status}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="turning"
                label="Truning"
                onChange={handleChange}
                value={formData.turning}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date"
                label="Date of Record"
                onChange={handleChange}
                value={formData.date}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>
          </Grid>{" "}
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
export default ViewIncubationRecord;
