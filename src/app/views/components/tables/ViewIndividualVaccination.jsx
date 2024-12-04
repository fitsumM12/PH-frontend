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
import { getBreeds, getHouses } from "app/apis/chicken_api";
import {
  addIndividualVaccination,
  getIndividualVaccinations,
  deleteIndividualVaccination,
  getIndividualVaccination,
  updateIndividualVaccinationInAPI,
  getIndividualDeaths,
} from "app/apis/individual_chicken_api";
import { getChickens } from "app/apis/individual_chicken_api";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useContext } from "react";
import AuthContext from "app/contexts/JWTAuthContext";
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

const ViewIndividualVaccination = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    id: 0,
    bird: 0,
    date: new Date().toISOString().split("T")[0],
    collector: user.id,
    disease_type: "",
    vaccine_type: "",
    vaccine_method: "",
    remark: "this is a remark",
  };

  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [breeds, setBreeds] = useState([]);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [groupVaccine, setIndividualVaccine] = useState(initialFormData);
  const [houses, setHouses] = useState([]);
  const [groupVaccines, setIndividualVaccines] = useState([]);
  const [groupchickens, setIndividualChickens] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [combinedData, setCombinedData] = useState({});
  const [aliveChickens, setAliveChickens] = useState([]);

  useEffect(() => {
    const fetchChickensAndDeaths = async () => {
      try {
        const chickensData = await getChickens();
        const deathsData = await getIndividualDeaths();


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
    const fetchIndividualVaccines = async () => {
      try {
        const groupVaccinesData = await getIndividualVaccinations();
        setIndividualVaccines(groupVaccinesData);
      } catch (error) {
        console.error("Error fetching Vaccine:", error);
      }
    };
    fetchIndividualVaccines();
  }, [add, del, edit]);

  useEffect(() => {
    const fetchIndividualChickens = async () => {
      try {
        const groupchickensData = await getChickens();
        setIndividualChickens(groupchickensData);
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

  const getIndividualDetails = (id) => {
    const groupchicken = groupchickens.find((h) => h.id === id);
    return groupchicken ? `${groupchicken.bird_id}` : "Unknown House";
  };

  useEffect(() => {
    if (groupchickens.length > 0 && houses.length > 0) {
      const combined = groupchickens.map((chicken) => {
        const house = houses.find((h) => h.id === chicken.house);
        return {
          ...chicken,
          house_number: house ? house.house_number : "Unknown",
          pen_number: house ? house.pen_number : "Unknown",
          location: house ? house.location : "Unknown",
        };
      });
      setCombinedData(combined);
    }
  }, [houses, groupchickens]);

  const handleDeleteIndividualVaccine = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this group Vaccine record?"
    );

    if (confirmed) {
      try {
        await deleteIndividualVaccination(id);
        setDelete((prev) => !prev);
      } catch (error) {
        console.error("Failed to delete the group Vaccine record:", error);
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
  const updateIndividualVaccine = async (id) => {
    setEdit(true);
    try {
      const response = await getIndividualVaccination(id);
      setIndividualVaccine(response);
    } catch (error) {
      console.error("Error fetching Vaccine:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await addIndividualVaccination(formData);
      setAdd(false);
    } catch (error) {
      console.error("Error adding Vaccine:", error);
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
    setIndividualVaccine({
      ...groupVaccine,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateVaccine = async (e) => {
    e.preventDefault();
    try {
      await updateIndividualVaccinationInAPI(groupVaccine.id, groupVaccine);
      setEdit(false);
      setAdd(false);
    } catch (error) {
      console.error("Error updating vaccine:", error);
    }
  };

  const handleDownLoad = () => {
    const fetchIndividualVaccines = async () => {
      try {
        const groupVaccinesData = await getIndividualVaccinations();
        const csvData = jsonToCsv(groupVaccinesData);
        downloadCsv(csvData, "groupvaccinesData.csv");
      } catch (error) {
        console.error("Error fetching deaths:", error);
      }
    };
    fetchIndividualVaccines();
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

  const [mergedData, setMergedData] = useState([]);
  const [filteredMergedDataForUser, setFilteredMergedDataForUser] = useState([]);
  
  useEffect(() => {
      const mergeData = async () => {
          try {
              if (groupchickens.length > 0 && groupVaccines.length > 0) {
                  const combinedVaccines = groupVaccines.map((vaccine) => {
                      const chicken = groupchickens.find(
                          (ch) => ch.id === vaccine.bird
                      );
                      return {
                          ...vaccine,
                          bird_id: chicken ? chicken.bird_id : "Unknown",
                          collector: vaccine.collector, // Assuming this exists
                      };
                  });
                  setMergedData(combinedVaccines);
              }
          } catch (error) {
              console.error("Error merging data:", error);
          }
      };
      mergeData();
  }, [groupVaccines, groupchickens]);
  
  // Filter Merged Data based on User Role
  useEffect(() => {
      if (user.role === "USER") {
          const filteredData = mergedData.filter((item) => item.collector === user.id);
          setFilteredMergedDataForUser(filteredData);
      } else {
          setFilteredMergedDataForUser(mergedData);
      }
  }, [mergedData, user]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const filteredVaccines = filteredMergedDataForUser.filter((vaccine) =>
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
                <TableCell align="center">Disease</TableCell>
                <TableCell align="center">Vaccine</TableCell>
                <TableCell align="center">Date</TableCell>
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
              {filteredVaccines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((Vaccine, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {getIndividualDetails(Vaccine.bird)}
                    </TableCell>
                    <TableCell align="center">{Vaccine.disease_type}</TableCell>
                    <TableCell align="center">{Vaccine.vaccine_type}</TableCell>
                    <TableCell align="center">{Vaccine.date}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            updateIndividualVaccine(Vaccine.id);
                          }}
                          sx={{ "&:hover": { bgcolor: "grey.200" } }}
                        >
                          <EditIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>

                      {user.role !== "USER" ? (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              handleDeleteIndividualVaccine(Vaccine.id)
                            }
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
            count={filteredVaccines.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </>
      ) : edit === true && add === false ? (
        <ValidatorForm onSubmit={handleUpdateVaccine} onError={() => null}>
          <Grid container spacing={6}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              {/* <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Individual ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setIndividualVaccine({
                                                ...groupVaccine,
                                                bird: value?.id || ''
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Individual"
                                                variant="outlined"
                                                required
                                            />
                                        )}
                                    />
                                </FormControl>
                                <br />
                                <br /> */}

              <TextField
                type="number"
                name="id"
                label="Vaccine ID"
                onChange={handleChangeEdit}
                value={groupVaccine.id}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="number"
                name="bird"
                label="Chicken Individual"
                onChange={handleChangeEdit}
                value={groupVaccine.bird}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date"
                label="Record Date"
                onChange={handleChangeEdit}
                value={groupVaccine.date}
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
                value={groupVaccine.collector}
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
                name="disease_type"
                label="Disease Type"
                onChange={handleChangeEdit}
                value={groupVaccine.disease_type}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="vaccine_type"
                label="Vaccine Type"
                onChange={handleChangeEdit}
                value={groupVaccine.vaccine_type}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="vaccine_method"
                label="Vaccination Method"
                onChange={handleChangeEdit}
                value={groupVaccine.vaccine_method}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="remark"
                label="Remark"
                onChange={handleChangeEdit}
                value={groupVaccine.remark}
              />
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
            </Grid>
          </Grid>
        </ValidatorForm>
      ) : (
        <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
          <Grid container spacing={6}>
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
                name="date"
                label="Record Date"
                onChange={handleChange}
                value={formData.date}
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
                value={formData.collector}
                InputProps={{
                  readOnly: true,
                }}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="disease_type"
                label="Disease Type"
                onChange={handleChange}
                value={formData.disease_type}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="text"
                name="vaccine_type"
                label="Vaccine Type"
                onChange={handleChange}
                value={formData.vaccine_type}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="vaccine_method"
                label="Vaccination Method"
                onChange={handleChange}
                value={formData.vaccine_method}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="text"
                name="remark"
                label="Remark"
                onChange={handleChange}
                value={formData.remark}
              />
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
            </Grid>
          </Grid>
        </ValidatorForm>
      )}
    </>
  );
};

export default ViewIndividualVaccination;
