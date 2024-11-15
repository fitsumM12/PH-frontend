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
import { getBreeds } from 'app/apis/chicken_api';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
// import { Span } from "app/components/Typography";
import { addBreed } from 'app/apis/chicken_api';
import { getBreed } from 'app/apis/chicken_api';
import { deleteBreed } from 'app/apis/chicken_api';
import { updateBreedInAPI } from 'app/apis/chicken_api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Span } from 'app/components/Typography';
const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const initialFormData = {
    id: 0,
    name: "",
    description: "This is a description"
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

const ViewBreed = () => {
    const [add, setAdd] = useState(false);
    const [del, setDelete] = useState(true)
    const [edit, setEdit] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [breeds, setBreeds] = useState([]);
    const [breed, setBreed] = useState([]);
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedsData = await getBreeds();
                setBreeds(breedsData);
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };
        fetchBreeds();
    }, [add, del, edit]);



    const handleDeleteBreed = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this breed?");

        if (confirmed) {
            try {
                await deleteBreed(id);
                setDelete(prev => !prev);
            } catch (error) {
                console.error('Failed to delete the breed:', error);
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
    const updateBreed = async (id) => {
        setEdit(true);
        try {
            const response = await getBreed(id);
            setBreed(response);
        } catch (error) {
            console.error('Error fetching breed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addBreed(formData);
            setAdd(false);
        } catch (error) {
            console.error('Error adding breed:', error);
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
        setBreed({
            ...breed,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateBreed = async (e) => {
        e.preventDefault();
        try {
            await updateBreedInAPI(breed.id, breed);
            setEdit(false);
            setAdd(false)
        } catch (error) {
            console.error('Error updating breed:', error);
        }
    };



    const handleDownLoad = () => {
        const fetchBreeds = async () => {
            try {
                const breedsData = await getBreeds();
                const csvData = jsonToCsv(breedsData);
                downloadCsv(csvData, 'breeds.csv');
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };

        fetchBreeds();
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
    const filterbreeds = breeds.filter((breed) =>
        String(breed.id).toLowerCase().includes(searchQuery.toLowerCase())
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
                                            label="Breed ID"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            name="id"
                                            value={searchQuery}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                        />
                                    </ValidatorForm>
                                </TableCell>
                                <TableCell align="center">Breed Name</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="right">
                                    Action |
                                    <Button onClick={addNew}>Add New</Button>
                                    <Button onClick={handleDownLoad}>Download</Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterbreeds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((breed, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{breed.id}</TableCell>
                                    <TableCell align="center">{breed.name}</TableCell>
                                    <TableCell align="center">{breed.description}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    updateBreed(breed.id);
                                                }}
                                                sx={{ '&:hover': { bgcolor: 'grey.200' } }}
                                            >
                                                <EditIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteBreed(breed.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
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
                        count={filterbreeds.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </>
            ) : (
                edit === true && add === false ? (
                    <ValidatorForm onSubmit={handleUpdateBreed} onError={() => null}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="id"
                                    label="Breed ID"
                                    onChange={handleChangeEdit}
                                    value={breed.id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Breed Name"
                                    onChange={handleChangeEdit}
                                    value={breed.name}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="description"
                                    label="Description"
                                    onChange={handleChangeEdit}
                                    value={breed.description}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                            </Grid>
                        </Grid>
                        <Tooltip title="Back">
                            <IconButton onClick={handleBack} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}>
                                <ArrowBackIosIcon sx={{ color: '#19B839' }} />
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
                                    name="name"
                                    label="Breed Name"
                                    onChange={handleChange}
                                    value={formData.name}
                                    validators={["required"]}
                                    errorMessages={["This field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="description"
                                    label="Description"
                                    onChange={handleChange}
                                    value={formData.description}
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

export default ViewBreed;
