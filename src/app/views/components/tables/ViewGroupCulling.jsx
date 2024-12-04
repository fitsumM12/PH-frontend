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
import { updateGroupDeathInAPI, getGroupCullings, deleteGroupCulling, getGroupCulling, addGroupCulling, updateGroupCullingInAPI } from 'app/apis/group_chicken_api';
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


const ViewGroupCulling = () => {

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
    const [groupculling, setGroupCulling] = useState(initialFormData);
    const [houses, setHouses] = useState([]);
    const [groupcullings, setGroupCullings] = useState([]);
    const [filteredGroupCullingsForUser, setFilteredGroupCullingsForUser] = useState([]);
    const [groupchickens, setGroupChickens] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [combinedData, setCombinedData] = useState({})

    // useEffect(() => {
    //     const fetchGroupCullings = async () => {
    //         try {
    //             const groupcullingsData = await getGroupCullings();
    //             setGroupCullings(groupcullingsData);
    //         } catch (error) {
    //             console.error('Error fetching cullings:', error);
    //         }
    //     };
    //     fetchGroupCullings();
    // }, [add, del, edit]);

    // Fetch Group Cullings (similar to Bodyweights, Eggs, and Deaths)
useEffect(() => {
    const fetchGroupCullings = async () => {
      try {
        const groupcullingsData = await getGroupCullings();
        setGroupCullings(groupcullingsData);
      } catch (error) {
        console.error('Error fetching cullings:', error);
      }
    };
    fetchGroupCullings();
  }, [add, del, edit]);
  
  // Filter Group Cullings based on User Role
  useEffect(() => {
    if (user.role === "USER") {
      const filteredData = groupcullings.filter(item => item.collector === user.id);
      setFilteredGroupCullingsForUser(filteredData);
    } else {
      setFilteredGroupCullingsForUser(groupcullings);
    }
  }, [groupcullings, user]);


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

    const handleDeleteGroupCulling = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this group culling record?");

        if (confirmed) {
            try {
                await deleteGroupCulling(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the group culling record:', error);
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
    const updateGroupCulling = async (id) => {
        setEdit(true);
        try {
            const response = await getGroupCulling(id);
            setGroupCulling(response);
        } catch (error) {
            console.error('Error fetching culling:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addGroupCulling(formData);
            setAdd(false);
        } catch (error) {
            console.error('Error adding culling:', error);
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
        setGroupCulling({
            ...groupculling,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateCulling = async (e) => {
        e.preventDefault();
        try {
            const updatedGroupCulling = {
                ...groupculling,
                male_count: parseInt(groupculling.male_count, 10),
                female_count: parseInt(groupculling.female_count, 10),
                total_count: parseInt(groupculling.total_count, 10),
            };
            await updateGroupCullingInAPI(groupculling.id, updatedGroupCulling);
    
            setEdit(false);
            setAdd(false);
        } catch (error) {
            console.error('Error updating culling:', error);
        }
    };
    const handleDownLoad = () => {
        const fetchGroupCullings = async () => {
            try {
                const groupdeathsData = await getGroupCullings();
                const csvData = jsonToCsv(groupdeathsData);
                downloadCsv(csvData, 'groupcullingsData.csv');
            } catch (error) {
                console.error('Error fetching cullings:', error);
            }
        };
        fetchGroupCullings();
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
    const filteredcullings = filteredGroupCullingsForUser.filter((culling) =>
        String(getGroupDetails(culling.chicken_group)).toLowerCase().includes(searchQuery.toLowerCase())
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
                                <TableCell align="center">Female </TableCell>
                                <TableCell align="center">Male </TableCell>
                                <TableCell align="center">Total Culling</TableCell>
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
                            {filteredcullings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((culling, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{getGroupDetails(culling.chicken_group)}</TableCell>
                                    <TableCell align="center">{culling.female_count}</TableCell>
                                    <TableCell align="center">{culling.male_count}</TableCell>
                                    <TableCell align="center">{culling.total_count}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateGroupCulling(culling.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>



                                        {user.role !== "USER" ? (<Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteGroupCulling(culling.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filteredcullings.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateCulling} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setGroupCulling({
                                                ...groupculling,
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
                                    onChange={handleChangeEdit}
                                    value={groupculling.date}
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
                                    value={groupculling.collector}
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
                                    value={groupculling.reason}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>



                                <TextField
                                    type="number"
                                    name="female_count"
                                    label="Female Count"
                                    onChange={handleChangeEdit}
                                    value={groupculling.female_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="male_count"
                                    label="Male Count"
                                    onChange={handleChangeEdit}
                                    value={groupculling.male_count}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="total_count"
                                    label="Total Count"
                                    onChange={handleChangeEdit}
                                    value={groupculling.total_count}
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
                    </ValidatorForm>
                )
            )}
        </>

    );
}

export default ViewGroupCulling;