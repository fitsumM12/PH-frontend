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
import { getChickens, getIndividualDeaths } from "app/apis/individual_chicken_api";
import {
  addIntake,
  getIntake,
  deleteIntake,
  updateIntakeInAPI,
  getIntakes,
} from "app/apis/individual_chicken_api";
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

const ViewIndividualIntake = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    id: 0,
    bird: 0,
    record_date: new Date().toISOString().split("T")[0],
    feed_given: 0.0,
    feed_refusal: 0.0,
    collector: user.id,
    remarks: 0,
  };
  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [intake, setIntake] = useState(initialFormData);
  const [chickens, setChickens] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [houses, setHouses] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [individualchickens, setIndividualChickens] = useState([]);
  const [aliveChickens, setAliveChickens] = useState([]);

  useEffect(() => {
    const fetchChickensAndDeaths = async () => {
      try {
        const chickensData = await getChickens();
        const deathsData = await getIndividualDeaths();

        setChickens(chickensData);

        const deadBirdIds = new Set(
          deathsData
            .filter((death) => death.condition.toLowerCase() === "dead")
            .map((death) => death.bird)
        );
        const alive = chickensData.filter(
          (chicken) => !deadBirdIds.has(chicken.id)
        );
        setAliveChickens(alive);
      } catch (error) {
        console.error("Error fetching chickens or death records:", error);
      }
    };

    fetchChickensAndDeaths();
  }, []);

  useEffect(() => {
    const fetchIndividualChickens = async () => {
      try {
        const individualchickensData = await getChickens();
        setIndividualChickens(individualchickensData);
      } catch (error) {
        console.error("Error fetching chickens:", error);
      }
    };

    fetchIndividualChickens();
  }, [add, edit]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsData = await getBreeds();
        setBreeds(breedsData);
      } catch (error) {
        console.error("Error fetching Breeds:", error);
      }
    };
    const fetchHouses = async () => {
      try {
        const housesData = await getHouses();
        setHouses(housesData);
      } catch (error) {
        console.error("Error fetching Houses:", error);
      }
    };
    fetchBreeds();
    fetchHouses();
  }, [add, edit]);

  const getBreedDetails = (id) => {
    const breed = breeds.find((b) => b.id === id);
    return breed ? `${breed.name}` : "Unknown Breed";
  };

  const getHouseDetails = (id) => {
    const house = houses.find((h) => h.id === id);
    return house
      ? `${house.house_number}-${house.pen_number}`
      : "Unknown House";
  };

  const getIndividualDetails = (id) => {
    const individualchicken = individualchickens.find((h) => h.id === id);
    return individualchicken ? `${individualchicken.bird_id}` : "Unknown House";
  };
  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        const bodyweightsData = await getIntakes();
        setIntakes(bodyweightsData);
      } catch (error) {
        console.error("Error fetching chickens:", error);
      }
    };
    fetchIntakes();
  }, [add, del, edit]);

  useEffect(() => {
    const fetchChickens = async () => {
      try {
        const chickensData = await getChickens();
        setChickens(chickensData);
      } catch (error) {
        console.error("Error fetching chickens:", error);
      }
    };

    fetchChickens();
  }, [add, edit]);

  const handleDeleteIntake = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this intake record?"
    );

    if (confirmed) {
      try {
        await deleteIntake(id);
        setDelete((prev) => !prev);
      } catch (error) {
        console.error("Failed to delete the intake record:", error);
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
  const updateIntake = async (id) => {
    setEdit(true);
    try {
      const response = await getIntake(id);
      setIntake(response);
    } catch (error) {
      console.error("Error fetching intake:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addIntake(formData);
      setAdd(false);
    } catch (error) {
      console.error("Error adding intake:", error);
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
    setIntake({
      ...intake,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateIntake = async (e) => {
    e.preventDefault();
    try {
      await updateIntakeInAPI(intake.id, intake);
      setEdit(false);
      setAdd(false);
    } catch (error) {
      console.error("Error updating intake:", error);
    }
  };

  const handleDownLoad = () => {
    const fetchIntakes = async () => {
      try {
        const intakeData = await getIntakes();
        const csvData = jsonToCsv(intakeData);
        downloadCsv(csvData, "intakedata.csv");
      } catch (error) {
        console.error("Error fetching bodyweight:", error);
      }
    };
    fetchIntakes();
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
  const [mergedData, setmergedData] = useState([]);
  useEffect(() => {
    if (individualchickens.length > 0 && intakes.length > 0) {
      const combinedVaccines = intakes.map((intake) => {
        const chicken = individualchickens.find((ch) => ch.id === intake.bird);
        return {
          ...intake,
          bird_id: chicken ? chicken.bird_id : "Unknown",
        };
      });
      setmergedData(combinedVaccines);
    }
  }, [intakes, individualchickens]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredintakes = mergedData.filter((vaccine) =>
    String(vaccine.bird_id).toLowerCase().includes(searchQuery.toLowerCase())
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
                      label="Chicken ID"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      name="bird"
                      value={searchQuery}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center">Feed Given</TableCell>
                <TableCell align="center">Feed Refusal</TableCell>
                <TableCell align="center">Record Date</TableCell>
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
              {filteredintakes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((intake, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {getIndividualDetails(intake.bird)}
                    </TableCell>
                    <TableCell align="center">{intake.feed_given}</TableCell>
                    <TableCell align="center">{intake.feed_refusal}</TableCell>
                    <TableCell align="center">{intake.record_date}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            updateIntake(intake.id);
                          }}
                          sx={{ "&:hover": { bgcolor: "grey.200" } }}
                        >
                          <EditIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                      {user.role !== "USER" ? (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteIntake(intake.id)}
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
            count={filteredintakes.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </>
      ) : edit === true && add === false ? (
        <ValidatorForm onSubmit={handleUpdateIntake} onError={() => null}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="bird_id"
                label="Chicken ID"
                onChange={handleChangeEdit}
                value={intake.bird}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="Date"
                name="record_date"
                label="Record Date"
                onChange={handleChangeEdit}
                value={intake.record_date}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="collector"
                label="Data Collector"
                onChange={handleChangeEdit}
                value={intake.collector}
                InputProps={{
                  readOnly: true,
                }}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="text"
                name="feed_given"
                label="Feed Given"
                onChange={handleChangeEdit}
                value={intake.feed_given}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="feed_refusal"
                label="Feed Refusal"
                onChange={handleChangeEdit}
                value={intake.feed_refusal}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="remarks"
                label="Remarks"
                onChange={handleChangeEdit}
                value={intake.remarks}
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
                <Autocomplete
                  options={aliveChickens}
                  getOptionLabel={(option) =>
                    `Chicken ID: ${option.bird_id}, Hatch: ${option.hatch} Sire: ${option.sire_id}, Dam: ${option.dam_id}`
                  }
                  onChange={(event, value) => {
                    setFormData({
                      ...formData,
                      bird: value?.id || "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Chicken"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </FormControl>
              <br />
              <br />

              <TextField
                type="Date"
                name="record_date"
                label="Record Date"
                onChange={handleChange}
                value={formData.record_date}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="collector"
                label="Data Collector"
                onChange={handleChange}
                value={intake.collector}
                InputProps={{
                  readOnly: true,
                }}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="feed_given"
                label="Feed Given"
                onChange={handleChange}
                value={formData.feed_given}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />
              <TextField
                type="number"
                name="feed_refusal"
                label="Feed Refusal"
                onChange={handleChange}
                value={formData.feed_refusal}
                validators={["required"]}
                errorMessages={["This field is required"]}
                step="0.01"
              />

              <TextField
                type="text"
                name="remarks"
                label="Remarks"
                onChange={handleChange}
                value={formData.remarks}
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

export default ViewIndividualIntake;
