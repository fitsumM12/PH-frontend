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
import { addGroupBodyweight, getGroupBodyweight, deleteGroupBodyweight, updateGroupBodyweightInAPI, getGroupBodyweights } from 'app/apis/group_chicken_api';
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


const ViewGroupBodyweight = () => {

    const { user } = useContext(AuthContext);

    const initialFormData = {
        id: 0,
        chicken_group: 0,
        record_date: new Date().toISOString().split('T')[0],
        age_in_weeks: 0,
        total_birds_weighted: 0,
        total_weight: 0,
        collector: user.id,
        remarks: "this is a remark"
    };


    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [groupbodyweight, setGroupBodyweight] = useState(initialFormData);
    const [houses, setHouses] = useState([]);
    const [groupbodyweights, setGroupBodyweights] = useState([]);
    const [groupchickens, setGroupChickens] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [combinedData, setCombinedData] = useState({})
    const [filteredgroupbodyweightsforuser, setFilteredgroupbodyweightsforuser] = useState([])
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        const fetchGroupBodyweights = async () => {
            try {
                const groupbodyweightsData = await getGroupBodyweights();
                setGroupBodyweights(groupbodyweightsData);
            } catch (error) {
                console.error('Error fetching chickens:', error);
            }
        };
        fetchGroupBodyweights();
    }, [add, del, edit]);

    useEffect(() => {
        if (user.role === "USER") {
            const filteredData = groupbodyweights.filter(item => item.collector === user.id);
            setFilteredgroupbodyweightsforuser(filteredData);
        } else {
            setFilteredgroupbodyweightsforuser(groupbodyweights);
        }
    }, [groupbodyweights, user]);




    console.log("group bodyweight: ", groupbodyweights)
    console.log("user", user)
    console.log("group bodyweight: filtered", filteredgroupbodyweightsforuser)


    useEffect(() => {
        const fetchGroupChickens = async () => {
            try {
                const groupchickensData = await getGroupChickens();
                setGroupChickens(groupchickensData);
            } catch (error) {
                console.error('Error fetching groupchickens:', error);
            }
        };
        fetchGroupChickens();
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
        const fetchHouses = async () => {
            try {
                const housesData = await getHouses();
                setHouses(housesData)
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchHouses()
    }, [add, del, edit])

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
    }, [groupchickens, houses]);


    const handleDeleteGroupBodyweight = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this group bodyweight record?");

        if (confirmed) {
            console.log(id);
            try {
                await deleteGroupBodyweight(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the group bodyweight record:', error);
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
    const updateGroupBodyweight = async (id) => {
        setEdit(true);
        try {
            const response = await getGroupBodyweight(id);
            setGroupBodyweight(response);
        } catch (error) {
            console.error('Error fetching chicken:', error);
        }
    };

    const handleSubmit = async (e) => {
        // console.log(formData)
        e.preventDefault();
        try {
            await addGroupBodyweight(formData);
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
        setGroupBodyweight({
            ...groupbodyweight,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateBodyweigtht = async (e) => {
        e.preventDefault();
        try {
            await updateGroupBodyweightInAPI(groupbodyweight.id, groupbodyweight);
            setEdit(false);
            setAdd(false)
        } catch (error) {
            console.error('Error updating groupbodyweight:', error);
        }
    };

    const handleDownLoad = () => {
        const fetchGroupBodyweights = async () => {
            try {
                const groupbodyweightsData = await getGroupBodyweights();
                const csvData = jsonToCsv(groupbodyweightsData);
                downloadCsv(csvData, 'groupbodyweightData.csv');
            } catch (error) {
                console.error('Error fetching groupbodyweight:', error);
            }
        };
        fetchGroupBodyweights();
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
    const filteredgroupbodyweights = filteredgroupbodyweightsforuser.filter((bodyweight) =>
        String(getGroupDetails(bodyweight.chicken_group)).toLowerCase().includes(searchQuery.toLowerCase())
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
                                <TableCell align="center">Total Chicken</TableCell>
                                <TableCell align="center">Total Weight</TableCell>
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
                            {filteredgroupbodyweights.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((groupbodyweight, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{getGroupDetails(groupbodyweight.chicken_group)}</TableCell>
                                    <TableCell align="center">{groupbodyweight.total_birds_weighted}</TableCell>
                                    <TableCell align="center">{groupbodyweight.total_weight}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateGroupBodyweight(groupbodyweight.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {user.role !== "USER" ? (
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDeleteGroupBodyweight(groupbodyweight.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filteredgroupbodyweights.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateBodyweigtht} onError={() => null}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        options={combinedData}
                                        getOptionLabel={(option) => `Group ID:${option.id}_House:${option.house_number}_Pen:${option.pen_number}`}
                                        onChange={(event, value) => {
                                            setGroupBodyweight({
                                                ...groupbodyweight,
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
                                    name="record_date"
                                    label="Record Date"
                                    onChange={handleChangeEdit}
                                    value={groupbodyweight.record_date}
                                    validators={["required"]}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="age_in_weeks"
                                    label="Age in Weeks"
                                    onChange={handleChangeEdit}
                                    value={groupbodyweight.age_in_weeks}
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

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                                <TextField
                                    type="number"
                                    name="total_birds_weighted"
                                    label="Total Chickens Weighted"
                                    onChange={handleChangeEdit}
                                    value={groupbodyweight.total_birds_weighted}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}

                                />

                                <TextField
                                    type="number"
                                    name="total_weight"
                                    label="Total Weight"
                                    onChange={handleChangeEdit}
                                    value={groupbodyweight.total_weight}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                    step={0.001}
                                />

                                <TextField
                                    type="text"
                                    name="remarks"
                                    label="Remarks"
                                    onChange={handleChangeEdit}
                                    value={groupbodyweight.remarks}
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
                                    name="record_date"
                                    label="Record Date"
                                    onChange={handleChange}
                                    value={new Date().toISOString().split('T')[0]}
                                    validators={["required"]}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="number"
                                    name="age_in_weeks"
                                    label="Age in Weeks"
                                    onChange={handleChange}
                                    value={formData.age_in_weeks}
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
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>


                                <TextField
                                    type="number"
                                    name="total_birds_weighted"
                                    label="Total Chickens Weighted"
                                    onChange={handleChange}
                                    value={formData.total_birds_weighted}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}

                                />
                                <TextField
                                    type="number"
                                    name="total_weight"
                                    label="Total Weight"
                                    onChange={handleChange}
                                    value={formData.total_weight}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                    step={0.001}
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

export default ViewGroupBodyweight;