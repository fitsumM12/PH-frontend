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
import { getBreeds } from 'app/apis/chicken_api';
import { getRequesters } from 'app/apis/requester_api';
import { addChickenDistribution, getChickenDistribution, deleteChickenDistribution, updateChickenDistributionInAPI, getChickenDistributions } from 'app/apis/chicken_distribution_api';
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

const ViewChickenDistribution = () => {

    const { user } = useContext(AuthContext);
    const initialFormData = {
        chicken_distribution_id: "",
        breed: 0,
        quantity_sold: 0,
        healthy_hatchlings_count: 0,
        number_of_eggs_incubated: 0,
        date_of_hatch: "",
        requester: 0,
        distributor_name: user.id,  
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
    const [chickendistributions, setChickenDistributions] = useState([]);
    const [chickendistribution, setChickenDistribution] = useState(initialFormData);
    const [breeds, setBreeds] = useState([]);
    const [requesters, setRequesters] = useState([]);
    const [formData, setFormData] = useState(initialFormData);

    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const fetchChickenDistributions = async () => {
            try {
                const chickendistributionsData = await getChickenDistributions();
                setChickenDistributions(chickendistributionsData);
            } catch (error) {
                console.error('Error fetching chickendistributions:', error);
            }
        };
        fetchChickenDistributions();
    }, [add, del, edit]);


    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedsData = await getBreeds();
                setBreeds(breedsData);
            } catch (error) {
                console.error('Error fetching Breeds:', error);
            }
        };
        const fetchRequesters = async () => {
            try {
                const requestersData = await getRequesters();
                setRequesters(requestersData);
            } catch (error) {
                console.error('Error fetching requesters:', error);
            }
        };
        fetchBreeds();
        fetchRequesters();
    }, [add, edit]);
    const getBreedDetails = (id) => {
        const breed = breeds.find((b) => b.id === id);
        return breed ? `${breed.name}` : 'Unknown Breed';
    };


    const getRequesterDetails = (id) => {
        const requester = requesters.find((r) => r.id === id);
        return requester ? `${requester.requester_name}` : 'no Requester';
    };

    const handleDeleteChickenDistribution = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this chickendistributions?");

        if (confirmed) {
            try {
                await deleteChickenDistribution(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the chickendstributions:', error);
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
    const updateChickenDistribution = async (id) => {
        setEdit(true);
        try {
            const response = await getChickenDistribution(id);
            setChickenDistribution(response);
        } catch (error) {
            console.error('Error fetching chickendistribution:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addChickenDistribution(formData);
            setAdd(false);
        } catch (error) {
            console.error('Error adding chickendistribution:', error);
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
        setChickenDistribution({
            ...chickendistribution,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateChickenDistribution = async (e) => {
        e.preventDefault();
        try {
            await updateChickenDistributionInAPI(chickendistribution.id, chickendistribution);
            setEdit(false);
            setAdd(false)
        } catch (error) {
            console.error('Error updating chickendistribution:', error);
        }
    };



    const handleDownLoad = () => {
        const fetchChickenDistributions = async () => {
            try {
                const chickenDistributionData = await getChickenDistributions();
                const csvData = jsonToCsv(chickenDistributionData);
                downloadCsv(csvData, 'chickendistribution.csv');
            } catch (error) {
                console.error('Error fetching chickendistributions:', error);
            }
        };
        fetchChickenDistributions();
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
    const filteredchickendistributions = chickendistributions.filter((chickendistribution) =>
        String(chickendistribution.chicken_distribution_id).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            label="Distribution ID"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            name=""
                                            value={searchQuery}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                        />
                                    </ValidatorForm>
                                </TableCell>
                                <TableCell align="center">requester</TableCell>
                                <TableCell align="center">Breed</TableCell>
                                <TableCell align="center">Eggs incubated</TableCell>
                                <TableCell align="center">Date of hatch</TableCell>
                                <TableCell align="center">quantity_sold</TableCell>
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
                            {filteredchickendistributions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((chickendistribution, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{chickendistribution.chicken_distribution_id}</TableCell>
                                    <TableCell align="center">{getRequesterDetails(chickendistribution.requester)}</TableCell>
                                    <TableCell align="center">{getBreedDetails(chickendistribution.breed)}</TableCell>
                                    <TableCell align="center">{chickendistribution.number_of_eggs_incubated}</TableCell>
                                    <TableCell align="center">{chickendistribution.date_of_hatch}</TableCell>
                                    <TableCell align="center">{chickendistribution.quantity_sold}</TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateChickenDistribution(chickendistribution.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {user.role !== 'USER' ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteChickenDistribution(chickendistribution.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filteredchickendistributions.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateChickenDistribution} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="chicken_distribution_id"
                                    label="chicken distribution id"
                                    onChange={handleChangeEdit}
                                    value={chickendistribution.chicken_distribution_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />


                                <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="breed-label">Breed</InputLabel>
                                    <Select
                                        labelId="breed-label"
                                        name="breed"
                                        value={chickendistribution.breed}
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
                                </FormControl>
                                <br />
                                <br />
                                <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="requester-label">Requester</InputLabel>
                                    <Select
                                        labelId="requester-label"
                                        name="requester"
                                        value={chickendistribution.requester}
                                        onChange={handleChangeEdit}
                                        label="requester"
                                        required
                                    >
                                        {requesters.map((requester) => (
                                            <MenuItem key={requester.id} value={requester.id}>
                                                {requester.requester_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <br />
                                <br />



                                <TextField
                                    type="Date"
                                    name="date_of_hatch"
                                    label="Hatch Date"
                                    onChange={handleChangeEdit}
                                    value={chickendistribution.date_of_hatch}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <br />
                                <br />

                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                                <TextField
                                    type="number"
                                    name="distributor_name"
                                    label="distributor name"
                                    onChange={handleChangeEdit}
                                    value={chickendistribution.distributor_name}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="number_of_eggs_incubated"
                                    label="number of eggs incubated"
                                    onChange={handleChangeEdit}
                                    value={chickendistribution.number_of_eggs_incubated}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="healthy_hatchlings_count"
                                    label="healthy hatchlings count"
                                    onChange={handleChangeEdit}
                                    value={chickendistribution.healthy_hatchlings_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <br />
                                <TextField
                                    type="number"
                                    name="quantity_sold"
                                    label="quantity sold"
                                    onChange={handleChangeEdit}
                                    value={chickendistribution.quantity_sold}
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
                                <TextField
                                    type="text"
                                    name="chicken_distribution_id"
                                    label="chicken distribution id"
                                    onChange={handleChange}
                                    value={formData.chicken_distribution_id}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={breeds}
                                        getOptionLabel={(option) =>
                                            `ID: ${option.id}, Name: ${option.name}`
                                        }
                                        onChange={(event, value) => {
                                            setFormData({
                                                ...formData,
                                                breed: value?.id || "",  
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
                                        options={requesters} 
                                        getOptionLabel={(option) => option.requester_name} 
                                        value={requesters.find(requester => requester.id === formData.requester) || null}  
                                        onChange={(event, value) => {
                                            setFormData({
                                                ...formData,
                                                requester: value?.id || "", 
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Requester"
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

                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>



                                <TextField
                                    type="number"
                                    name="distributor_name"
                                    label="distributor name"
                                    onChange={handleChange}
                                    value={formData.distributor_name}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="number_of_eggs_incubated"
                                    label="number of eggs incubated"
                                    onChange={handleChange}
                                    value={formData.number_of_eggs_incubated}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="healthy_hatchlings_count"
                                    label="healthy hatchlings count"
                                    onChange={handleChange}
                                    value={formData.healthy_hatchlings_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="quantity_sold"
                                    label="quantity sold"
                                    onChange={handleChange}
                                    value={formData.quantity_sold}
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

export default ViewChickenDistribution;