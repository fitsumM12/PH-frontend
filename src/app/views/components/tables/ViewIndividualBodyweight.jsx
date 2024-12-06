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
  addBodyweight,
  getBodyweight,
  deleteBodyweight,
  updateBodyweightInAPI,
  getBodyweights,
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

const ViewIndividualBodyweight = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    id: 0,
    bird: 0,
    record_date: new Date().toISOString().split("T")[0],
    weight: "",
    collector: user.id,
    remarks: "this is a desciption",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [bodyweight, setBodyweight] = useState(initialFormData);
  const [chickens, setChickens] = useState([]);
  const [bodyweights, setBodyweights] = useState([]);
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
                    .filter(death => death.condition.toLowerCase() === "dead") 
                    .map(death => death.bird) 
            );
            const alive = chickensData.filter(chicken => !deadBirdIds.has(chicken.id)); 
            setAliveChickens(alive);
        } catch (error) {
            console.error('Error fetching chickens or death records:', error);
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
    const fetchBodyweights = async () => {
      try {
        const bodyweightsData = await getBodyweights();
        setBodyweights(bodyweightsData);
      } catch (error) {
        console.error("Error fetching chickens:", error);
      }
    };
    fetchBodyweights();
  }, [add, del, edit]);

 
  const handleDeleteBodyweight = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bodyweight record?"
    );

    if (confirmed) {
      try {
        await deleteBodyweight(id);
        setDelete((prev) => !prev);
      } catch (error) {
        console.error("Failed to delete the bodyweight:", error);
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
  const updateBodyweight = async (id) => {
    setEdit(true);
    try {
      const response = await getBodyweight(id);
      // console.log('fetched data', response)
      setBodyweight(response);
    } catch (error) {
      console.error("Error fetching chicken:", error);
    }
  };

  const handleSubmit = async (e) => {
    // console.log(formData)
    e.preventDefault();
    try {
      await addBodyweight(formData);
      setAdd(false);
    } catch (error) {
      console.error("Error adding chicken:", error);
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
    setBodyweight({
      ...bodyweight,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateBodyweigtht = async (e) => {
    e.preventDefault();
    try {
      await updateBodyweightInAPI(bodyweight.id, bodyweight);
      setEdit(false);
      setAdd(false);
    } catch (error) {
      console.error("Error updating bodyweight:", error);
    }
  };

  const handleDownLoad = () => {
    const fetchBodyweights = async () => {
      try {
        const bodyweightsData = await getBodyweights();
        const csvData = jsonToCsv(bodyweightsData);
        downloadCsv(csvData, "bodyweightData.csv");
      } catch (error) {
        console.error("Error fetching bodyweight:", error);
      }
    };
    fetchBodyweights();
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
    if (individualchickens.length > 0 && bodyweights.length > 0) {
      const combined = bodyweights.map((bodyweight) => {
        const chicken = individualchickens.find(
          (ch) => ch.id === bodyweight.bird
        );
        return {
          ...bodyweight,
          bird_id: chicken ? chicken.bird_id : "Unknown",
        };
      });
      setmergedData(combined);
    }
  }, [bodyweights, individualchickens]);
  const filteredBodyweights = mergedData.filter((bodyweight) =>
    String(bodyweight.bird_id).toLowerCase().includes(searchQuery.toLowerCase())
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
                      name="chickenId"
                      value={searchQuery}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center">Weight</TableCell>
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
              {filteredBodyweights
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((bodyweight, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {getIndividualDetails(bodyweight.bird)}
                    </TableCell>

                    <TableCell align="center">{bodyweight.weight}</TableCell>
                    <TableCell align="center">
                      {bodyweight.record_date}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            updateBodyweight(bodyweight.id);
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
                              handleDeleteBodyweight(bodyweight.id)
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
            count={filteredBodyweights.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </>
      ) : edit === true && add === false ? (
        <ValidatorForm onSubmit={handleUpdateBodyweigtht} onError={() => null}>
          <Grid container spacing={6}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="bird"
                label="Chicken ID"
                onChange={handleChangeEdit}
                value={bodyweight.bird}
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
                value={bodyweight.record_date}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="weight"
                label="Weight"
                onChange={handleChangeEdit}
                value={bodyweight.weight}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="collector"
                label="Data Collector"
                onChange={handleChangeEdit}
                value={bodyweight.collector}
                InputProps={{
                  readOnly: true,
                }}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="remarks"
                label="Remarks"
                onChange={handleChangeEdit}
                value={bodyweight.remarks}
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
                value={new Date().toISOString().split("T")[0]}
                validators={["required"]}
                InputProps={{
                  readOnly: true,
                }}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="number"
                name="weight"
                label="Weight(g)"
                onChange={handleChange}
                value={formData.weight}
                validators={["required"]}
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

export default ViewIndividualBodyweight;
