import React, { useState, useEffect } from 'react';
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
    MenuItem, Select
} from "@mui/material";
import {
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { FormControl, InputLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getHouses } from 'app/apis/chicken_api';
import { getBreeds } from 'app/apis/chicken_api';
import { addChicken, getChicken, deleteChicken, updateChickenInAPI, getChickens, addIndividualDeath } from 'app/apis/individual_chicken_api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useContext } from 'react';
import AuthContext from 'app/contexts/JWTAuthContext';
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));



const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
    }
}));


const ViewIndividualChicken = () => {

    const { user } = useContext(AuthContext);
    const initialFormData = {
        id: 0,
        bird_id: '',
        breed: 0,
        house: 0,
        date_of_hatch: '',
        point_of_lay_date: '',
        generation: 0,
        hatch: '',
        annotator: user.id,
        sire_id: '',
        dam_id: '',
        sex: '',
        remarks: "This is a remark"

    };
    const initialFormDataForMortality = {
        id: 0,
        bird: 0,
        date: new Date().toISOString().split('T')[0],
        condition: 'alive',
        collector: user.id,
        reason: 'good healthy'
    };
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [chickens, setChickens] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [houses, setHouses] = useState([]);
    const [chicken, setChicken] = useState(initialFormData);
    const [formData, setFormData] = useState(initialFormData);

    const [searchQuery, setSearchQuery] = useState('');
    // const [chickens, setChickens] = useState([]);
    const [filteredChickensForUser, setFilteredChickensForUser] = useState([]);

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
    }, [add, del, edit]);

    // Filter Chickens based on User Role
    useEffect(() => {
        if (user.role === "USER") {
            const filteredData = chickens.filter((item) => item.annotator === user.id);
            setFilteredChickensForUser(filteredData);
        } else {
            setFilteredChickensForUser(chickens);
        }
    }, [chickens, user]);


    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedsData = await getBreeds();
                setBreeds(breedsData);
            } catch (error) {
                console.error('Error fetching Breeds:', error);
            }
        };
        const fetchHouses = async () => {
            try {
                const housesData = await getHouses();
                setHouses(housesData);
            } catch (error) {
                console.error('Error fetching Houses:', error);
            }
        };
        fetchBreeds();
        fetchHouses();
    }, [add, edit]);
    const getBreedDetails = (id) => {
        const breed = breeds.find((b) => b.id === id);
        return breed ? `${breed.name}` : 'Unknown Breed';
    };


    const getHouseDetails = (id) => {
        const house = houses.find((h) => h.id === id);
        return house ? `${house.house_number}: ${house.pen_number}` : 'Unknown House';
    };

    const handleDeleteChicken = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this chicken?");

        if (confirmed) {
            try {
                await deleteChicken(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the chicken:', error);
            }
        } else {
            console.log('Deletion cancelled');
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
    const updateChicken = async (id) => {
        setEdit(true);
        try {
            const response = await getChicken(id);
            setChicken(response);
        } catch (error) {
            console.error('Error fetching chicken:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addChicken(formData);
            initialFormDataForMortality.bird = res.id
            await addIndividualDeath(initialFormDataForMortality)
            setAdd(false);
        } catch (error) {
            console.error('Error adding chicken:', error);
        }
    };

    const handleBack = () => {
        setAdd(false)
        setEdit(false)
    }
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    const handleChangeEdit = (event) => {
        setChicken({
            ...chicken,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateChicken = async (e) => {
        e.preventDefault();
        try {
            await updateChickenInAPI(chicken.id, chicken);
            setEdit(false);
            setAdd(false)
        } catch (error) {
            console.error('Error updating chicken:', error);
        }
    };



    const handleDownLoad = () => {
        const fetchChickens = async () => {
            try {
                const chickensData = await getChickens();
                const csvData = jsonToCsv(chickensData);
                downloadCsv(csvData, 'chicken.csv');
            } catch (error) {
                console.error('Error fetching chickens:', error);
            }
        };
        fetchChickens();
    };

    function jsonToCsv(jsonData) {
        const keys = Object.keys(jsonData[0]);
        const csvRows = jsonData.map(row =>
            keys.map(key => JSON.stringify(row[key], null, '')).join(',')
        );

        csvRows.unshift(keys.join(','));
        return csvRows.join('\n');
    }

    function downloadCsv(csvData, filename) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    const filteredchickens = filteredChickensForUser.filter((chicken) =>
        String(chicken.bird_id).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            name="bird_id"
                                            value={searchQuery}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                        />
                                    </ValidatorForm>
                                </TableCell>
                                <TableCell align="center">Breed</TableCell>
                                <TableCell align="center">House</TableCell>
                                <TableCell align="center">Hatch Date</TableCell>
                                <TableCell align="center">Lay Date </TableCell>
                                <TableCell align="center">Generation</TableCell>
                                <TableCell align="right">
                                    Action | <Button onClick={addNew}>Add New</Button>
                                </TableCell>
                                {user.role !== 'USER' ? (
                                    <TableCell align="left">
                                        <Button onClick={handleDownLoad}>Download</Button>
                                    </TableCell>) : (null)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredchickens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((chicken, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{chicken.bird_id}</TableCell>
                                    <TableCell align="center">{getBreedDetails(chicken.breed)}</TableCell>
                                    <TableCell align="center">{getHouseDetails(chicken.house)}</TableCell>
                                    <TableCell align="center">{chicken.date_of_hatch}</TableCell>
                                    <TableCell align="center">{chicken.point_of_lay_date}</TableCell>
                                    <TableCell align="center">{chicken.generation}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateChicken(chicken.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {user.role !== 'USER' ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteChicken(chicken.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>) : (null)}
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
                        count={filteredchickens.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateChicken} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={breeds}
                                        getOptionLabel={(option) => option.name}
                                        value={breeds.find((breed) => breed.id === chicken.breed) || null}
                                        onChange={(event, value) => {
                                            handleChangeEdit({
                                                target: {
                                                    name: 'breed',
                                                    value: value?.id || '',
                                                },
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
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={houses}
                                        getOptionLabel={(option) => `House: ${option.house_number} Pen: ${option.pen_number}`}
                                        value={houses.find((house) => house.id === chicken.house) || null}
                                        onChange={(event, value) => {
                                            handleChangeEdit({
                                                target: {
                                                    name: 'house',
                                                    value: value?.id || '',
                                                },
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select House"
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
                                    name="date_of_hatch"
                                    label="Hatch Date"
                                    onChange={handleChangeEdit}
                                    value={chicken.date_of_hatch}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="Date"
                                    name="point_of_lay_date"
                                    label="Point of Lay Date"
                                    onChange={handleChangeEdit}
                                    value={chicken.point_of_lay_date}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="generation"
                                    label="Generation"
                                    onChange={handleChangeEdit}
                                    value={chicken.generation}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="hatch"
                                    label="Hatch"
                                    onChange={handleChangeEdit}
                                    value={chicken.hatch}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="bird_id"
                                    label="Bird ID"
                                    onChange={handleChangeEdit}
                                    value={chicken.bird_id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <TextField
                                    type="number"
                                    name="annotator"
                                    label="Data Collector"
                                    onChange={handleChangeEdit}
                                    value={chicken.annotator}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="sire_id"
                                    label="Sire ID"
                                    onChange={handleChangeEdit}
                                    value={chicken.sire_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="dam_id"
                                    label="Dam ID"
                                    onChange={handleChangeEdit}
                                    value={chicken.dam_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <RadioGroup
                                    row
                                    name="sex"
                                    label="Sex"
                                    sx={{ mb: 2 }}
                                    value={chicken.sex}
                                    onChange={handleChangeEdit}
                                >
                                    <FormControlLabel
                                        value="Male"
                                        label="Male"
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                    <FormControlLabel
                                        value="Female"
                                        label="Female"
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                    <FormControlLabel
                                        value="Others"
                                        label="Others"
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                </RadioGroup>
                                <TextField
                                    type="text"
                                    name="remarks"
                                    label="Remarks"
                                    onChange={handleChangeEdit}
                                    value={chicken.remarks}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>
                        </Grid>
                        <Tooltip title="Back">
                            <IconButton onClick={handleBack} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}>
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;

                        <Button
                            sx={{
                                backgroundColor: '#30BA4E',
                                '&:hover': {
                                    backgroundColor: '#28A745',
                                },
                            }}
                            variant="contained"
                            type="submit"
                        >
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                                Update
                            </Span>
                        </Button>
                    </ValidatorForm>
                ) : (
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={breeds}
                                        getOptionLabel={(option) =>
                                            `ID: ${option.id}, Name: ${option.name}`
                                        }
                                        onChange={(event, value) => {
                                            setFormData({
                                                ...formData,
                                                breed: value?.id || "",  // Set the breed ID in formData
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


                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={houses}
                                        getOptionLabel={(option) =>
                                            `House: ${option.house_number}, Pen: ${option.pen_number}`
                                        }
                                        onChange={(event, value) => {
                                            setFormData({
                                                ...formData,
                                                house: value?.id || "",  // Set the house ID in formData
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select House"
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
                                    name="date_of_hatch"
                                    label="Hatch Date"
                                    onChange={handleChange}
                                    value={formData.date_of_hatch}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="Date"
                                    name="point_of_lay_date"
                                    label="Point of Lay Date"
                                    onChange={handleChange}
                                    value={formData.point_of_lay_date}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="generation"
                                    label="Generation"
                                    onChange={handleChange}
                                    value={formData.generation}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="hatch"
                                    label="Hatch"
                                    onChange={handleChange}
                                    value={formData.hatch}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>


                                <TextField
                                    type="text"
                                    name="bird_id"
                                    label="Bird ID"
                                    onChange={handleChange}
                                    value={formData.bird_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="annotator"
                                    label="Data Collector"
                                    onChange={handleChange}
                                    value={formData.annotator}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="sire_id"
                                    label="Sire ID"
                                    onChange={handleChange}
                                    value={formData.sire_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="dam_id"
                                    label="Dam ID"
                                    onChange={handleChange}
                                    value={formData.dam_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <RadioGroup
                                    row
                                    name="sex"
                                    label="Sex"
                                    sx={{ mb: 2 }}
                                    value={formData.sex}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel
                                        value="Male"
                                        label="Male"
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                    <FormControlLabel
                                        value="Female"
                                        label="Female"
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                    <FormControlLabel
                                        value="Others"
                                        label="Others"
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                </RadioGroup>
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
                            <IconButton onClick={handleBack} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}>
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            sx={{
                                backgroundColor: '#30BA4E',
                                '&:hover': {
                                    backgroundColor: '#28A745',
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
                )
            )}
        </>

    );
}

export default ViewIndividualChicken;