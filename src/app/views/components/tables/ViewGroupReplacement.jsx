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
import { getGroupReplacements, deleteGroupReplacement, addGroupReplacement, updateGroupReplacementInAPI, getGroupReplacement } from 'app/apis/group_chicken_api';
import { getGroupChickens } from 'app/apis/group_chicken_api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useContext } from 'react';
import { Alert } from '@mui/material';
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


const ViewGroupReplacement = () => {

    const { user } = useContext(AuthContext);
    const initialFormData = {
        id: 0,
        chicken_group: 0,
        date: new Date().toISOString().split('T')[0],
        male_count: 0,
        female_count: 0,
        total_count: 0,
        collector: user.id,
        reason: 'this is a remark'
    };
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [breeds, setBreeds] = useState([]);
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupReplacement, setGroupReplacement] = useState(initialFormData);
    const [houses, setHouses] = useState([]);
    const [groupReplacements, setGroupReplacements] = useState([]);
    const [filteredGroupReplacementsForUser, setFilteredGroupReplacementsForUser] = useState([]);
    const [groupchickens, setGroupChickens] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [combinedData, setCombinedData] = useState({})
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // useEffect(() => {
    //     const fetchGroupReplacements = async () => {
    //         try {
    //             const groupReplacementsData = await getGroupReplacements();
    //             setGroupReplacements(groupReplacementsData);
    //         } catch (error) {
    //             console.error('Error fetching Replacement:', error);
    //         }
    //     };
    //     fetchGroupReplacements();
    // }, [add, del, edit]);

    // Fetch Group Replacements (similar to Bodyweights, Eggs, Deaths, and Cullings)
useEffect(() => {
    const fetchGroupReplacements = async () => {
      try {
        const groupReplacementsData = await getGroupReplacements();
        setGroupReplacements(groupReplacementsData);
      } catch (error) {
        console.error('Error fetching Replacement:', error);
      }
    };
    fetchGroupReplacements();
  }, [add, del, edit]);
  
  // Filter Group Replacements based on User Role
  useEffect(() => {
    if (user.role === "USER") {
      const filteredData = groupReplacements.filter(item => item.collector === user.id);
      setFilteredGroupReplacementsForUser(filteredData);
    } else {
      setFilteredGroupReplacementsForUser(groupReplacements);
    }
  }, [groupReplacements, user]);


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

    const handleDeleteGroupReplacement = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this group Replacement record?");

        if (confirmed) {
            try {
                await deleteGroupReplacement(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the group Replacement record:', error);
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
    const updateGroupReplacement = async (id) => {
        setEdit(true);
        try {
            const response = await getGroupReplacement(id);
            setGroupReplacement(response);
        } catch (error) {
            console.error('Error fetching Replacement:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Await the API call and get the response
            const response = await addGroupReplacement(formData);
            
            // Check if the response contains the data we expect
            if (response && response.id) { // Assuming `id` is part of the success response
                setMessage('Replacement record added successfully!'); // Success message
                setError(''); // Clear any errors
                setAdd(false); // Close the form or reset state as needed
            } else {
                throw new Error('Unexpected response structure'); // Error if the response is not as expected
            }
        } catch (error) {
            // Check if the error is an AxiosError or similar
            if (error.isAxiosError) {
                console.error('Error submitting form data:', error);
    
                // Check for error response and handle accordingly
                if (error.response) {
                    console.error('Full error response:', error.response);
                    setError(error.response.data.error || 'An error occurred.');
                    setMessage(''); // Clear success message if error occurs
                } else {
                    // Handle network or no response scenario
                    setError('Network error or no response from server.');
                    setMessage('');
                }
            } else {
                // Handle other errors
                console.error('Error adding replacement:', error);
                setError('An unexpected error occurred.');
                setMessage('');
            }
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
        setGroupReplacement({
            ...groupReplacement,
            [event.target.name]: event.target.value,
        });
    };
    

    const handleUpdateReplacement = async (e) => {
        e.preventDefault();
        try {
            const updatedGroupReplacement= {
                ...groupReplacement,
                male_count: parseInt(groupReplacement.male_count, 10),
                female_count: parseInt(groupReplacement.female_count, 10),
                total_count: parseInt(groupReplacement.total_count, 10),
            };
            await updateGroupReplacementInAPI(groupReplacement.id, updatedGroupReplacement);
    
            setEdit(false);
            setAdd(false);
        } catch (error) {
            console.error('Error updating replacement:', error);
        }
    };



    const handleDownLoad = () => {
        const fetchGroupReplacements = async () => {
            try {
                const groupReplacementsData = await getGroupReplacements();
                const csvData = jsonToCsv(groupReplacementsData);
                downloadCsv(csvData, 'groupreplacementsData.csv');
            } catch (error) {
                console.error('Error fetching deaths:', error);
            }
        };
        fetchGroupReplacements();
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
    const filteredReplacements = filteredGroupReplacementsForUser.filter((Replacement) =>
        String(getGroupDetails(Replacement.chicken_group)).toLowerCase().includes(searchQuery.toLowerCase())
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
                                <TableCell align="center">Female Replace</TableCell>
                                <TableCell align="center">Male Replaced</TableCell>
                                <TableCell align="center">Total Replace</TableCell>
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
                            {filteredReplacements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((Replacement, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{getGroupDetails(Replacement.chicken_group)}</TableCell>
                                    <TableCell align="center">{Replacement.female_count}</TableCell>
                                    <TableCell align="center">{Replacement.male_count}</TableCell>
                                    <TableCell align="center">{Replacement.total_count}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateGroupReplacement(Replacement.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>



                                        {user.role !== "USER" ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteGroupReplacement(Replacement.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filteredReplacements.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateReplacement} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                {/* <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setGroupReplacement({
                                                ...groupReplacement,
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
                                </FormControl> */}

<FormControl variant="outlined" fullWidth>
  <Autocomplete
    options={combinedData}
    getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
    value={combinedData.find((group) => group.id === groupReplacement.chicken_group) || null}   
    onChange={(event, value) => {
      setGroupReplacement({
        ...groupReplacement,
        chicken_group: value?.id || '',   
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
                                    onChange={handleChangeEdit}
                                    value={groupReplacement.date}
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
                                    value={groupReplacement.collector}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="reason"
                                    label="Reason"
                                    onChange={handleChangeEdit}
                                    value={groupReplacement.reason}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>



                                <TextField
                                    type="number"
                                    name="female_count"
                                    label="Female Count"
                                    onChange={handleChangeEdit}
                                    value={groupReplacement.female_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="male_count"
                                    label="Male Count"
                                    onChange={handleChangeEdit}
                                    value={groupReplacement.male_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="total_count"
                                    label="Total Count"
                                    onChange={handleChangeEdit}
                                    value={groupReplacement.total_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
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
                                    name="reason"
                                    label="Reason"
                                    onChange={handleChange}
                                    value={formData.reason}
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
                                    name="total_count"
                                    label="Total Count"
                                    onChange={handleChange}
                                    value={formData.total_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
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
                        {message && <Alert severity="success">{message}</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}
                    </ValidatorForm>
                )
            )}
        </>

    );
}

export default ViewGroupReplacement;