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
import { FormControl} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { getBreeds, getHouses } from 'app/apis/chicken_api';
import { addGroupEgg, getGroupEgg, deleteGroupEgg, updateGroupEggInAPI, getGroupEggs } from 'app/apis/group_chicken_api';
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


const ViewGroupEgg = () => {

    const { user } = useContext(AuthContext);
    const initialFormData = {
        id: 0,
        chicken_group: 0,
        collection_date: new Date().toISOString().split('T')[0],
        morning_egg_production: 0,
        afternoon_egg_production: 0,
        total_egg_production: 0,
        collector: user.id,
        remarks:'this is a remark'
    };
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupegg, setGroupEgg] = useState(initialFormData);
    const [houses, setHouses] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [groupeggs, setGroupEggs] = useState([]);
    const [filteredGroupEggsForUser, setFilteredGroupEggsForUser] = useState([]);
    const [groupchickens, setGroupChickens] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [combinedData, setCombinedData] = useState({})

    // useEffect(() => {
    //     const fetchGroupEggs = async () => {
    //         try {
    //             const groupeggsData = await getGroupEggs();
    //             setGroupEggs(groupeggsData);
    //         } catch (error) {
    //             console.error('Error fetching chickens:', error);
    //         }
    //     };
    //     fetchGroupEggs();
    // }, [add, del, edit]);


    // Fetch Group Eggs (similar to Group Bodyweights)
useEffect(() => {
    const fetchGroupEggs = async () => {
      try {
        const groupeggsData = await getGroupEggs();
        setGroupEggs(groupeggsData);
      } catch (error) {
        console.error('Error fetching eggs:', error);
      }
    };
    fetchGroupEggs();
  }, [add, del, edit]);
  
  // Filter Group Eggs based on User Role
  useEffect(() => {
    if (user.role === "USER") {
      const filteredData = groupeggs.filter(item => item.collector === user.id);
      setFilteredGroupEggsForUser(filteredData);
    } else {
      setFilteredGroupEggsForUser(groupeggs);
    }
  }, [groupeggs, user]);


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

    const handleDeleteGroupEgg = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this group egg record?");
        
        if (confirmed) {
            try {
                await deleteGroupEgg(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the group egg record:', error);
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
    const updateGroupEgg = async (id) => {
        setEdit(true);
        try {
            const response = await getGroupEgg(id);
            setGroupEgg(response);
        } catch (error) {
            console.error('Error fetching chicken:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addGroupEgg(formData);
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
        setGroupEgg({
            ...groupegg,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateEgg= async (e) => {
        e.preventDefault();
        try {
            await updateGroupEggInAPI(groupegg.id, groupegg);
            setEdit(false);
            setAdd(false)
        } catch (error) {
            console.error('Error updating groupegg:', error);
        }
    };

    const handleDownLoad = () => {
        const fetchGroupEggs = async () => {
            try {
                const groupeggsData = await getGroupEggs();
                const csvData = jsonToCsv(groupeggsData);
                downloadCsv(csvData, 'groupeggData.csv');
            } catch (error) {
                console.error('Error fetching groupegg:', error);
            }
        };
        fetchGroupEggs();
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
    const filteredeggs = filteredGroupEggsForUser.filter((egg) =>
        String(getGroupDetails(egg.chicken_group)).toLowerCase().includes(searchQuery.toLowerCase())
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
                                <TableCell align="center">Morning </TableCell>
                                <TableCell align="center">Afternoon </TableCell>
                                <TableCell align="center">Total</TableCell>
                                <TableCell align="center">Collection Date</TableCell>
                                <TableCell align="right">
                                    Action | <Button onClick={addNew}>Add New</Button>
                                </TableCell>
                                
                                {user.role!=="USER"?( 
                                <TableCell align="left">
                                    <Button onClick={handleDownLoad}>Download</Button>
                                </TableCell>):(null)}
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredeggs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((groupegg, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{getGroupDetails(groupegg.chicken_group)}</TableCell>
                                    <TableCell align="center">{groupegg.morning_egg_production}</TableCell>
                                    <TableCell align="center">{groupegg.afternoon_egg_production}</TableCell>
                                    <TableCell align="center">{groupegg.total_egg_production}</TableCell>
                                    <TableCell align="center">{groupegg.collection_date}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateGroupEgg(groupegg.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        
                                    
                                    {user.role!=="USER"?( <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteGroupEgg(groupegg.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>):(null)}
                                    </TableCell>
                                    
                                    {user.role!=="USER"?( 
                                    <TableCell align="center"></TableCell>):(null)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                    <TablePagination
                        sx={{ px: 2 }}
                        page={page}
                        component="div"
                        rowsPerPage={rowsPerPage}
                        count={filteredeggs.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateEgg} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setGroupEgg({
                                                ...groupegg,
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
                                    name="collection_date"
                                    label="Record Date"
                                    onChange={handleChangeEdit}
                                    value={groupegg.collection_date}
                                    validators={["required"]}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="morning_egg_production"
                                    label="Morning Egg"
                                    onChange={handleChangeEdit}
                                    value={groupegg.morning_egg_production}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="afternoon_egg_production"
                                    label="Afternoon Egg"
                                    onChange={handleChangeEdit}
                                    value={groupegg.afternoon_egg_production}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                            <TextField
                                    type="number"
                                    name="total_egg_production"
                                    label="Total Egg"
                                    onChange={handleChangeEdit}
                                    value={groupegg.total_egg_production}
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
                                    label="remarks"
                                    onChange={handleChange}
                                    value={groupegg.remarks}
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
                                    name="collection_date"
                                    label="Record Date"
                                    onChange={handleChange}
                                    value={formData.collection_date}
                                    validators={["required"]}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="morning_egg_production"
                                    label="Morning Egg"
                                    onChange={handleChange}
                                    value={formData.morning_egg_production}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="afternoon_egg_production"
                                    label="Afternoon Egg"
                                    onChange={handleChange}
                                    value={formData.afternoon_egg_production}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                            <TextField
                                    type="number"
                                    name="total_egg_production"
                                    label="Total Egg"
                                    onChange={handleChange}
                                    value={formData.total_egg_production}
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
                                    label="remarks"
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

export default ViewGroupEgg;