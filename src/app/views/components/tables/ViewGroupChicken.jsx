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
import { FormControl, InputLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getHouses } from 'app/apis/chicken_api';
import { getBreeds } from 'app/apis/chicken_api';
import { addGroupChicken, getGroupChicken, deleteGroupChicken, updateGroupChickenInAPI, getGroupChickens } from 'app/apis/group_chicken_api';
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


const ViewGroupChicken = () => {
    const { user } = useContext(AuthContext);
    const initialFormData = {
        id: 0,
        breed: 0,
        house: 0,
        collector: user.id,
        date_of_hatch: '',
        point_of_lay_date: '',
        female_count: 0,
        male_count: 0,
        total_bird_count: 0,
    };
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupChickens, setGroupChickens] = useState([]);
    const [groupchicken, setGroupChicken] = useState(initialFormData);
    const [formData, setFormData] = useState(initialFormData);

    const [breeds, setBreeds] = useState([]);
    const [houses, setHouses] = useState([]);
    const [filteredGroupChickensForUser, setFilteredGroupChickensForUser] = useState([]);

    useEffect(() => {
        const fetchGroupChickens = async () => {
            try {
                const groupChickensData = await getGroupChickens();
                setGroupChickens(groupChickensData);
            } catch (error) {
                console.error('Error fetching groupChickens:', error);
            }
        };
        fetchGroupChickens();
    }, [add, del, edit]);

    // Filter Group Chickens based on User Role
    useEffect(() => {
        if (user.role === 'USER') {
            const filteredData = groupChickens.filter(item => item.collector === user.id);
            setFilteredGroupChickensForUser(filteredData);
        } else {
            setFilteredGroupChickensForUser(groupChickens);
        }
    }, [groupChickens, user]);


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

    const handleDeleteGroupChicken = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this group of chickens?");

        if (confirmed) {
            // console.log(id);
            try {
                await deleteGroupChicken(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the group of chickens:', error);
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
    const updateGroupChicken = async (id) => {
        setEdit(true);
        try {
            const response = await getGroupChicken(id);
            setGroupChicken(response);
        } catch (error) {
            console.error('Error fetching groupchicken:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addGroupChicken(formData);
            setAdd(false);
        } catch (error) {
            console.error('Error adding groupchicken:', error);
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
        setGroupChicken({
            ...groupchicken,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateGroupChicken = async (e) => {
        // console.log(groupchicken)
        e.preventDefault();
        try {
            await updateGroupChickenInAPI(groupchicken.id, groupchicken);
            setEdit(false);
            setAdd(false)
        } catch (error) {
            console.error('Error updating groupchicken:', error);
        }
    };



    const handleDownLoad = () => {
        const fetchGroupChickens = async () => {
            try {
                const groupchickensData = await getGroupChickens();
                const csvData = jsonToCsv(groupchickensData);
                downloadCsv(csvData, 'groupchicken.csv');
            } catch (error) {
                console.error('Error fetching groupchickens:', error);
            }
        };
        fetchGroupChickens();
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
    const filteredgroupchickens = filteredGroupChickensForUser.filter((groupchicken) =>
        String(groupchicken.id).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            name="bird"
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
                                <TableCell align="center">Total Chicken</TableCell>
                                <TableCell align="right">
                                    Action | <Button onClick={addNew}>Add New</Button>
                                </TableCell>
                                {user.role !== "USER" ? (<TableCell align="left">
                                    <Button onClick={handleDownLoad}>Download</Button>
                                </TableCell>) : (null)}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredgroupchickens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((groupchicken, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{groupchicken.id}</TableCell>
                                    <TableCell align="center">{getBreedDetails(groupchicken.breed)}</TableCell>
                                    <TableCell align="center">{getHouseDetails(groupchicken.house)}</TableCell>
                                    <TableCell align="center">{groupchicken.date_of_hatch}</TableCell>
                                    <TableCell align="center">{groupchicken.point_of_lay_date}</TableCell>
                                    <TableCell align="center">{groupchicken.total_bird_count}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateGroupChicken(groupchicken.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {user.role !== "USER" ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteGroupChicken(groupchicken.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filteredgroupchickens.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateGroupChicken} onError={() => null}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                {/* <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="breed-label">Breed</InputLabel>
                                    <Select
                                        labelId="breed-label"
                                        name="breed"
                                        value={groupchicken.breed}
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
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={breeds}
                                        getOptionLabel={(option) => option.name}
                                        value={breeds.find((breed) => breed.id === groupchicken.breed) || null}
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
                                        value={houses.find((house) => house.id === groupchicken.house) || null}
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
                                    value={groupchicken.date_of_hatch}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="Date"
                                    name="point_of_lay_date"
                                    label="Point of Lay Date"
                                    onChange={handleChangeEdit}
                                    value={groupchicken.point_of_lay_date}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="number"
                                    name="female_count"
                                    label="Female Count"
                                    onChange={handleChangeEdit}
                                    value={groupchicken.female_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="male_count"
                                    label="Male Count"
                                    onChange={handleChangeEdit}
                                    value={groupchicken.male_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <TextField
                                    type="number"
                                    name="total_bird_count"
                                    label="Total"
                                    onChange={handleChangeEdit}
                                    value={groupchicken.total_bird_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <TextField
                                    type="number"
                                    name="collector"
                                    label="Data Collector"
                                    onChange={handleChangeEdit}
                                    value={groupchicken.collector}
                                    InputProps={{
                                        readOnly: true,
                                    }}
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
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                {/* <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="breed-label">Breed</InputLabel>
                                    <Select
                                        labelId="breed-label"
                                        name="breed"
                                        value={formData.breed}
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
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="number"
                                    name="female_count"
                                    label="Female Count"
                                    onChange={handleChange}
                                    value={formData.female_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="male_count"
                                    label="Male Count"
                                    onChange={handleChange}
                                    value={formData.male_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="total_bird_count"
                                    label="Total Count"
                                    onChange={handleChange}
                                    value={formData.total_bird_count}
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

export default ViewGroupChicken;