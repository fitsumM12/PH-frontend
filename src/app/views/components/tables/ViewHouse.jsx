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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getHouses } from 'app/apis/chicken_api';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { addHouse } from 'app/apis/chicken_api';
import { getHouse } from 'app/apis/chicken_api';
import { deleteHouse } from 'app/apis/chicken_api';
import { updateHouseInAPI } from 'app/apis/chicken_api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const initialFormData = {
    id: 0,
    house_number: "",
    pen_number: '',
    capacity: 0,
    location: "",
    remarks: "This is a description"
};



const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
    }
}));

const ViewHouse = () => {
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [houses, setHouses] = useState([]);
    const [house, setHouse] = useState([]);
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const housesData = await getHouses();
                setHouses(housesData);
            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        };
        fetchHouses();
    }, [add, del, edit]);



    const handleDeleteHouse = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this house?");

        if (confirmed) {
            try {
                await deleteHouse(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the house:', error);
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
    const updateHouse = async (id) => {
        setEdit(true);
        try {
            const response = await getHouse(id);
            setHouse(response);
        } catch (error) {
            console.error('Error fetching house:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addHouse(formData);
            setAdd(false);
        } catch (error) {
            console.error('Error adding house:', error);
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
        setHouse({
            ...house,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateHouse = async (e) => {
        e.preventDefault();
        try {
            await updateHouseInAPI(house.id, house);
            setEdit(false);
            setAdd(false)
            // console.log('House updated successfully!');
        } catch (error) {
            console.error('Error updating house:', error);
        }
    };

    const handleDownLoad = () => {
        const fetchHouses = async () => {
            try {
                const housesData = await getHouses();
                const csvData = jsonToCsv(housesData);
                downloadCsv(csvData, 'houses_pen.csv');
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };

        fetchHouses();
    };

    const jsonToCsv = (jsonData) => {
        const keys = Object.keys(jsonData[0]);
        const csvRows = jsonData.map(row =>
            keys.map(key => JSON.stringify(row[key], null, '')).join(',')
        );

        csvRows.unshift(keys.join(','));
        return csvRows.join('\n');
    }

    const downloadCsv = (csvData, filename) => {
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
    const filterhouses = houses.filter((house) =>
        String(house.pen_number).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            label="Pen No."
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            name="pen_number"
                                            value={searchQuery}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                        />
                                    </ValidatorForm>
                                </TableCell>
                                <TableCell align="center">House No.</TableCell>
                                <TableCell align="center">Capacity</TableCell>
                                {/* <TableCell align="center">Location</TableCell> */}
                                <TableCell align="right">
                                    Action |
                                    <Button onClick={addNew}>Add New</Button>
                                    <Button onClick={handleDownLoad}>Download</Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterhouses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((house, index) => (
                                <TableRow key={index}>
                                    {/* <TableCell align="center">{house.id}</TableCell> */}
                                    <TableCell align="center">{house.pen_number}</TableCell>
                                    <TableCell align="center">{house.house_number}</TableCell>
                                    <TableCell align="center">{house.capacity}</TableCell>
                                    {/* <TableCell align="center">{house.location}</TableCell> */}
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateHouse(house.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteHouse(house.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                    <TablePagination
                        sx={{ px: 2 }}
                        page={page}
                        component="div"
                        rowsPerPage={rowsPerPage}
                        count={filterhouses.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateHouse} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="id"
                                    label="House ID"
                                    onChange={handleChangeEdit}
                                    value={house.id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="house_number"
                                    label="House No."
                                    onChange={handleChangeEdit}
                                    value={house.house_number}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                /> <TextField
                                    type="text"
                                    name="pen_number"
                                    label="Pen Number"
                                    onChange={handleChangeEdit}
                                    value={house.pen_number}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                /> 
                            </Grid>
                            
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                    type="number"
                                    name="capacity"
                                    label="Capacity"
                                    onChange={handleChangeEdit}
                                    value={house.capacity}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                /> <TextField
                                    type="text"
                                    name="location"
                                    label="Location"
                                    onChange={handleChangeEdit}
                                    value={house.location}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="remarks"
                                    label="Description"
                                    onChange={handleChangeEdit}
                                    value={house.remarks}
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
                               
                                <TextField
                                    type="text"
                                    name="house_number"
                                    label="House No."
                                    onChange={handleChange}
                                    value={formData.house_number}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                /> <TextField
                                    type="text"
                                    name="pen_number"
                                    label="Pen Number"
                                    onChange={handleChange}
                                    value={formData.pen_number}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                /> 
                                  <TextField
                                    type="number"
                                    name="capacity"
                                    label="Capacity"
                                    onChange={handleChange}
                                    value={formData.capacity}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                               <TextField
                                    type="text"
                                    name="location"
                                    label="Location"
                                    onChange={handleChange}
                                    value={formData.location}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="remarks"
                                    label="Description"
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

export default ViewHouse;
