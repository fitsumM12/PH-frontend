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
    MenuItem,
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getBreeds, getHouses } from 'app/apis/chicken_api';
import { getIndividualDeath, deleteIndividualDeath, getIndividualDeaths, addIndividualDeath, updateIndividualDeathInAPI } from 'app/apis/individual_chicken_api';
import { getChickens } from 'app/apis/individual_chicken_api';
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


const ViewIndividualDeath = () => {

    const { user } = useContext(AuthContext);
    const initialFormData = {
        id: 0,
        bird: 0,
        date: new Date().toISOString().split('T')[0],
        condition: 'alive',
        collector: user.id,
        reason: 'this is a remark'
    };
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [individualdeath, setIndividualDeath] = useState(initialFormData);
    const [houses, setHouses] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [individualdeaths, setIndividualDeaths] = useState([]);
    const [individualchickens, setIndividualChickens] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [combinedData, setCombinedData] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addIndividualDeath(formData);
            setAdd(false);
            setFormData(initialFormData); 
        } catch (error) {
            console.error('Error adding deaths:', error);
            if (error.response) {
                console.error("Server response:", error.response.data); 
            }
        }
    };
    

const handleUpdateDeath = async (e) => {
    e.preventDefault();
    try {
        await updateIndividualDeathInAPI(individualdeath.id, individualdeath);
        setEdit(false);
        setIndividualDeath(initialFormData); 
    } catch (error) {
        console.error('Error updating deaths:', error);
    }
};

const handleChangeEdit = (event) => {
    setIndividualDeath({
        ...individualdeath,
        [event.target.name]: event.target.value,
    });
};

const handleChange = (event) => {
    setFormData({
        ...formData,
        [event.target.name]: event.target.value,
    });
};

    useEffect(() => {
        const fetchIndividualDeaths = async () => {
            try {
                const individualdeathsData = await getIndividualDeaths();
                setIndividualDeaths(individualdeathsData);
            } catch (error) {
                console.error('Error fetching chickens:', error);
            }
        };
        fetchIndividualDeaths();
    }, [add, del, edit]);


    useEffect(() => {
        const fetchIndividualChickens = async () => {
            try {
                const individualchickensData = await getChickens();
                setIndividualChickens(individualchickensData);
            } catch (error) {
                console.error('Error fetching chickens:', error);
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

 

    const getIndividualDetails = (id) => {
        const individualchicken = individualchickens.find((h) => h.id === id);
        return individualchicken ? `${individualchicken.bird_id}` : 'Unknown House';
    };


    useEffect(() => {
        if (individualchickens.length > 0 && houses.length > 0) {
            const combined = individualchickens.map((chicken) => {
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
    }, [houses, individualchickens]);

    const handleDeleteIndividualDeath = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this individual death record?");

        if (confirmed) {
            try {
                await deleteIndividualDeath(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the individual deaths record:', error);
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
    const updateIndividualDeath = async (id) => {
        setEdit(true);
        try {
            const response = await getIndividualDeath(id);
            setIndividualDeath(response);
        } catch (error) {
            console.error('Error fetching deaths:', error);
        }
    };


    const handleBack = () => {
        setAdd(false)
        setEdit(false)
    }
    

    const handleDownLoad = () => {
        const fetchIndividualDeaths = async () => {
            try {
                const individualdeathsData = await getIndividualDeaths();
                const csvData = jsonToCsv(individualdeathsData);
                downloadCsv(csvData, 'individualdeathsData.csv');
            } catch (error) {
                console.error('Error fetching deaths:', error);
            }
        };
        fetchIndividualDeaths();
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


    const [mergedData, setmergedData] = useState([]); 
    useEffect(() => {
        if (individualchickens.length > 0 && individualdeaths.length > 0) {
            const combinedDeaths = individualdeaths.map((death) => {
                const chicken = individualchickens.find((ch) => ch.id === death.bird);
                return {
                    ...death,
                    bird_id: chicken ? chicken.bird_id : 'Unknown',
                };
            });
            setmergedData(combinedDeaths); 
        }
    }, [individualdeaths, individualchickens]);
    const [searchQuery, setSearchQuery] = useState('');
    const filtereddeaths = mergedData.filter((death) =>
        String(death.bird_id).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            label="Individual ID"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            name="bird"
                                            value={searchQuery}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                        />
                                    </ValidatorForm>
                                </TableCell>
                                <TableCell align="center">Condition</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="right">
                                    Action
                                </TableCell>

                                {user.role !== "USER" ? (
                                    <TableCell align="left">
                                        <Button onClick={handleDownLoad}>Download</Button>
                                    </TableCell>) : (null)}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtereddeaths.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((groudeath, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{getIndividualDetails(groudeath.bird)}</TableCell>
                                    <TableCell align="center">{groudeath.condition}</TableCell>
                                    <TableCell align="center">{groudeath.date}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateIndividualDeath(groudeath.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>


{/* 
                                        {user.role !== "USER" ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteIndividualDeath(groudeath.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>) : (null)} */}
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
                        count={filtereddeaths.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateDeath} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>                           
                                <TextField
                                    type="number"
                                    name="bird"
                                    label="bird"
                                    onChange={handleChangeEdit}
                                    value={individualdeath.bird}
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
                                    value={individualdeath.date}
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
                                    value={individualdeath.collector}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <TextField
                                    select
                                    name="condition"
                                    label="Condition"
                                    onChange={handleChangeEdit}
                                    value={individualdeath.condition}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                    fullWidth
                                >
                                    <MenuItem value="alive">Alive</MenuItem>
                                    <MenuItem value="dead">Dead</MenuItem>
                                </TextField>
                                <TextField
                                    type="text"
                                    name="reason"
                                    label="Reason"
                                    onChange={handleChangeEdit}
                                    value={individualdeath.reason}
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
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Chicken ID:${option.bird_id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setFormData({
                                                ...formData,
                                                bird: value?.bird_id || ''
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
                                <br />
                                <TextField
                                    type="Date"
                                    name="date"
                                    label="Record Date"
                                    onChange={handleChange}
                                    value={individualdeath.date}
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
                                    select
                                    name="condition"
                                    label="Condition"
                                    onChange={handleChange}
                                    value={formData.condition}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                    fullWidth
                                >
                                    <MenuItem value="alive">Alive</MenuItem>
                                    <MenuItem value="dead">Dead</MenuItem>
                                </TextField>
                                <TextField
                                    type="text"
                                    name="reason"
                                    label="Reason"
                                    onChange={handleChange}
                                    value={formData.reason}
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

export default ViewIndividualDeath;