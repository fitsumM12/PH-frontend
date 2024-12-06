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
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getBreeds, getHouses } from 'app/apis/chicken_api';
import { addGroupVaccination, getGroupVaccinations, deleteGroupVaccination, getGroupVaccination, updateGroupVaccinationInAPI } from 'app/apis/group_chicken_api';
import { getGroupChickens } from 'app/apis/group_chicken_api';
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


const ViewGroupVaccination = () => {

    const { user } = useContext(AuthContext);
    const initialFormData = {
        id: 0,
        chicken_group: 0,
        date: new Date().toISOString().split('T')[0],
        collector: user.id,
        disease_type: '',
        vaccine_type: '',
        vaccine_method: '',
        remark: 'this is a remark'
    };


    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [breeds, setBreeds] = useState([]);
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupVaccine, setGroupVaccine] = useState(initialFormData);
    const [houses, setHouses] = useState([]);
    const [groupVaccines, setGroupVaccines] = useState([]);
    const [groupchickens, setGroupChickens] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [combinedData, setCombinedData] = useState({})

    useEffect(() => {
        const fetchGroupVaccines = async () => {
            try {
                const groupVaccinesData = await getGroupVaccinations();
                setGroupVaccines(groupVaccinesData);
            } catch (error) {
                console.error('Error fetching Vaccine:', error);
            }
        };
        fetchGroupVaccines();
    }, [add, del, edit]);


    useEffect(() => {
        const fetchGroupChickens = async () => {
            try {
                const groupchickensData = await getGroupChickens();
                setGroupChickens(groupchickensData);
            } catch (error) {
                console.error('Error fetching chickens:', error);
            }
        };

        fetchGroupChickens();
    }, [add, edit]);

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
        return house ? `${house.pen_number}` : 'Unknown House';
    };


    const getGroupDetails = (id) => {
        const groupchicken = groupchickens.find((h) => h.id === id);
        return groupchicken ? `${groupchicken.id}: ${getBreedDetails(groupchicken.breed)}-${getHouseDetails(groupchicken.house)}` : 'Unknown House';
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

    const handleDeleteGroupVaccine = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this group Vaccine record?");

        if (confirmed) {
            try {
                await deleteGroupVaccination(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the group Vaccine record:', error);
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
    const updateGroupVaccine = async (id) => {
        setEdit(true);
        try {
            const response = await getGroupVaccination(id);
            setGroupVaccine(response);
        } catch (error) {
            console.error('Error fetching Vaccine:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addGroupVaccination(formData);
            setAdd(false);
        } catch (error) {
            console.error('Error adding Vaccine:', error);
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
        setGroupVaccine({
            ...groupVaccine,
            [event.target.name]: event.target.value,
        });
    };


    const handleUpdateVaccine = async (e) => {
        e.preventDefault();
        try {
            await updateGroupVaccinationInAPI(groupVaccine.id, groupVaccine);
            setEdit(false);
            setAdd(false);
        } catch (error) {
            console.error('Error updating vaccine:', error);
        }
    };



    const handleDownLoad = () => {
        const fetchGroupVaccines = async () => {
            try {
                const groupVaccinesData = await getGroupVaccinations();
                const csvData = jsonToCsv(groupVaccinesData);
                downloadCsv(csvData, 'groupvaccinesData.csv');
            } catch (error) {
                console.error('Error fetching deaths:', error);
            }
        };
        fetchGroupVaccines();
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

    const [searchQuery, setSearchQuery] = useState('');
    const filteredVaccines = groupVaccines.filter((Vaccine) =>
        String(getGroupDetails(Vaccine.chicken_group)).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            label="Group ID"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            name="chicken_group"
                                            value={searchQuery}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
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
                                    </TableCell>) : (null)}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredVaccines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Vaccine, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{getGroupDetails(Vaccine.chicken_group)}</TableCell>
                                    <TableCell align="center">{Vaccine.disease_type}</TableCell>
                                    <TableCell align="center">{Vaccine.vaccine_type}</TableCell>
                                    <TableCell align="center">{Vaccine.date}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateGroupVaccine(Vaccine.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>



                                        {user.role !== "USER" ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteGroupVaccine(Vaccine.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filteredVaccines.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateVaccine} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                {/* <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setGroupVaccine({
                                                ...groupVaccine,
                                                chicken_group: value?.id || ''
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Group"
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
                                    name="chicken_group"
                                    label="Chicken Group"
                                    onChange={handleChangeEdit}
                                    value={groupVaccine.chicken_group}
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
                                    type="number"
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

                            </Grid>
                        </Grid>
                    </ValidatorForm>
                ) : (
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setFormData({
                                                ...formData,
                                                chicken_group: value?.id || ''
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Group"
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
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                )
            )}
        </>

    );
}

export default ViewGroupVaccination;