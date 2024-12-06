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
  addHatcherSummary,
  deleteHatcherSummary,
  getHatcherRecords,
  getHatcherSummary,
  getHatcherSummarys,
  updateHatcherSummaryInAPI,
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

const ViewHatcherSummary = () => {
  const { user } = useContext(AuthContext);
  const initialFormData = {
    id: 0,
    hatchery_record: 0,
    breed_of_chicken: 0,
    number_set: 0,
    total_infertile_eggs: 0,
    infertile_percentage: 0,
    total_hatched: 0,
    hatch_percentage: 0,
    place_of_distribution: 0.0,
    collector: user.id,
    remarks: "",
    date: new Date().toISOString().split("T")[0],
  };

  const [add, setAdd] = useState(false);
  const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hatcherySummarys, setHatcherySummarys] = useState([]);
  const [hatcherySummary, setHatcherySummary] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [breeds, setBreeds] = useState([]);
  const [hatcheryRecords, setHatcheryRecords] = useState([]);

  useEffect(() => {
    const fetchHatcherySummarys = async () => {
      try {
        const hacheryData = await getHatcherSummarys();
        setHatcherySummarys(hacheryData);
      } catch (error) {
        console.error("Error fetching fetchHatcherySummarys:", error);
      }
    };
    fetchHatcherySummarys();
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

  const handleDeleteHatcherySummarys = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this incubation records?"
    );

    if (confirmed) {
      try {
        await deleteHatcherSummary(id);
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
  const updateHatcherySummarys = async (id) => {
    setEdit(true);
    try {
      const response = await getHatcherSummary(id);
      setHatcherySummary(response);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addHatcherSummary(formData);
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
    setHatcherySummary({
      ...hatcherySummary,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateHatcherySummary = async (e) => {
    e.preventDefault();
    try {
      await updateHatcherSummaryInAPI(hatcherySummary.id, hatcherySummary);
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
    const fetchHatcherySummarys = async () => {
      try {
        const housesData = await getHatcherSummarys();
        const csvData = jsonToCsv(housesData);
        downloadCsv(csvData, "incubationrecords.csv");
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchHatcherySummarys();
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
  const filterrecords = hatcherySummarys.filter((record) =>
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
                      name="id"
                      value={searchQuery}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center">Hatchery</TableCell>
                <TableCell align="center">Chicken Breed</TableCell>
                <TableCell align="center">Number of Set</TableCell>
                <TableCell align="center">Infertile Egg</TableCell>
                <TableCell align="center">Total Hatched</TableCell>
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
                      {record.hatchery_record}
                    </TableCell>
                    <TableCell align="center">
                      {getBreedDetails(record.breed_of_chicken)}
                    </TableCell>
                    <TableCell align="center">{record.number_set}</TableCell>
                    <TableCell align="center">
                      {record.total_infertile_eggs}
                    </TableCell>
                    <TableCell align="center">{record.total_hatched}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => updateHatcherySummarys(record.id)}
                          sx={{ "&:hover": { bgcolor: "grey.200" } }}
                        >
                          <EditIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                      {user.role !== "USER" && (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              handleDeleteHatcherySummarys(record.id)
                            }
                            sx={{ "&:hover": { bgcolor: "grey.200" } }}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      )}
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
          onSubmit={handleUpdateHatcherySummary}
          onError={() => null}
        >
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Hatchery Record</InputLabel>
                <Select
                  labelId="breed-label"
                  name="hatchery_record"
                  value={hatcherySummary.hatchery_record}
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

              <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Breed</InputLabel>
                <Select
                  labelId="breed-label"
                  name="breed_of_chicken"
                  value={hatcherySummary.breed_of_chicken}
                  onChange={handleChangeEdit}
                  label="Hatchery Record"
                  required
                >
                  {breeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {getBreedDetails(breed.id)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />
              <br />
              <TextField
                type="number"
                name="number_set"
                label="Number Set"
                onChange={handleChangeEdit}
                value={hatcherySummary.number_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="total_infertile_eggs"
                label="Infertile Egg"
                onChange={handleChangeEdit}
                value={hatcherySummary.total_infertile_eggs}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="infertile_percentage"
                label="Infertile Percentage (%)"
                onChange={handleChangeEdit}
                value={hatcherySummary.infertile_percentage}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="total_hatched"
                label="Total Hatched"
                onChange={handleChangeEdit}
                value={hatcherySummary.total_hatched}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="number"
                name="hatch_percentage"
                label="Hatched Precentage(%)"
                onChange={handleChangeEdit}
                value={hatcherySummary.hatch_percentage}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="place_of_distribution"
                label="Distribution Place"
                onChange={handleChangeEdit}
                value={hatcherySummary.place_of_distribution}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="text"
                name="remarks"
                label="Remarks"
                onChange={handleChangeEdit}
                value={hatcherySummary.remarks}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="Date"
                name="date"
                label="Date of Record"
                onChange={handleChangeEdit}
                value={hatcherySummary.date}
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
                  {hatcheryRecords.filter((hatch) => {
                    const existsInSummary = hatcherySummarys.some(
                      (summary) => summary.hatchery_record === hatch.id
                    );
                    return !existsInSummary;
                  }).length === 0 ? (
                    <MenuItem disabled>
                      All records are attached to the summary. Please go back
                      and edit if needed.
                    </MenuItem>
                  ) : (
                    hatcheryRecords
                      .filter(
                        (hatch) =>
                          !hatcherySummarys.some(
                            (summary) => summary.hatchery_record === hatch.id
                          )
                      )
                      .map((hatch) => (
                        <MenuItem key={hatch.id} value={hatch.id}>
                          {hatch.id +
                            ": " +
                            getBreedDetails(hatch.breed_of_chicken) +
                            ": " +
                            hatch.date_of_transfer}
                        </MenuItem>
                      ))
                  )}
                </Select>
              </FormControl>

              <br />
              <br />

              <FormControl variant="outlined" fullWidth>
                <InputLabel id="breed-label">Breed</InputLabel>
                <Select
                  labelId="breed-label"
                  name="breed_of_chicken"
                  value={formData.breed_of_chicken}
                  onChange={handleChange}
                  label="Hatchery Record"
                  required
                >
                  {breeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {getBreedDetails(breed.id)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />
              <br />
              <TextField
                type="number"
                name="number_set"
                label="Number Set"
                onChange={handleChange}
                value={formData.number_set}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="total_infertile_eggs"
                label="Infertile Egg"
                onChange={handleChange}
                value={formData.total_infertile_eggs}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="infertile_percentage"
                label="Infertile Percentage (%)"
                onChange={handleChange}
                value={formData.infertile_percentage}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <TextField
                type="number"
                name="total_hatched"
                label="Total Hatched"
                onChange={handleChange}
                value={formData.total_hatched}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />
              <TextField
                type="number"
                name="hatch_percentage"
                label="Hatched Precentage(%)"
                onChange={handleChange}
                value={formData.hatch_percentage}
                validators={["required"]}
                errorMessages={["This field is required"]}
              />

              <TextField
                type="number"
                name="place_of_distribution"
                label="Distribution Place"
                onChange={handleChange}
                value={formData.place_of_distribution}
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
export default ViewHatcherSummary;
