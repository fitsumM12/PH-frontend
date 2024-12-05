import React, { useState, useEffect } from "react";
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
  Box,
  Tooltip,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { blockUser } from "app/apis/users_api";
import { approveUser } from "app/apis/users_api";
import MenuItem from "@mui/material/MenuItem";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import DeleteIcon from "@mui/icons-material/Delete";
import { Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
// import PopupCard from './PopupCard';
// import { Menu } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

import InputLabel from "@mui/material/InputLabel";
import { addUser, getUser } from "app/apis/users_api";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import { deleteUser } from "app/apis/users_api";
import { getUsers } from "app/apis/users_api";
// import RecordManageCard from "../RecordManageCard";
import { updateUserInAPI } from "app/apis/users_api";
import UserManageCard from "../UserManageCard";
import AuthContext from "app/contexts/JWTAuthContext";
import { useContext } from "react";
import { Span } from "app/components/Typography";
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const initialFormData = {
  id: 0,
  username: "",
  first_name: "",
  last_name: "",
  birthday: new Date().toISOString().split("T")[0],
  gender: "",
  email: "",
  password: "",
  mobile: "",
  region: "",
  zone: "",
  kebele: "",
  organization: "",
  status: "PENDING",
  role: "",
};

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const ManageUser = () => {
  const { user } = useContext(AuthContext);
  const [add, setAdd] = useState(false);
  // const [del, setDelete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [change, setChange] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [user1, setUser] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  // const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  useEffect(() => {
    const fetchuser1s = async () => {
      try {
        const user1sData = await getUsers();
        setUsers(user1sData);
      } catch (error) {
        console.error("Error fetching user1s:", error);
      }
    };
    fetchuser1s();
  }, [change]);

  // const handleDeleteUser = async (id) => {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this user1?"
  //   );
  //   if (confirmed) {
  //     try {
  //       await deleteUser(id);
  //       setDelete((prev) => !prev);
  //     } catch (error) {
  //       console.error("Failed to delete the user:", error);
  //     }
  //   } else {
  //     console.log("Deletion cancelled");
  //   }
  // };

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
  const updateUser = async (id) => {
    setEdit(true);
    try {
      const response = await getUser(id);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addUser(formData);
      setAdd(false);
      setChange(!change);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleBack = () => {
    setAdd(false);
    setEdit(false);
  };
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeEdit = (event) => {
    setUser({
      ...user1,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUserInAPI(user1.id, user1);
      setEdit(false);
      setAdd(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // const handleDownLoad = () => {
  //   const fetchUsers = async () => {
  //     try {
  //       const usersData = await getUsers();
  //       const csvData = jsonToCsv(usersData);
  //       downloadCsv(csvData, "users_information.csv");
  //     } catch (error) {
  //       console.error("Error fetching breeds:", error);
  //     }
  //   };

  //   fetchUsers();
  // };

  // const jsonToCsv = (jsonData) => {
  //   const keys = Object.keys(jsonData[0]);
  //   const csvRows = jsonData.map((row) =>
  //     keys.map((key) => JSON.stringify(row[key], null, "")).join(",")
  //   );

  //   csvRows.unshift(keys.join(","));
  //   return csvRows.join("\n");
  // };
  const handleBlock = async (userId) => {
    try {
      await blockUser(userId);
      setChange(!change);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      setChange(!change);
    } catch (error) {
      console.log(error);
    }
  };

  // const downloadCsv = (csvData, filename) => {
  //   const blob = new Blob([csvData], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.setAttribute("hidden", "");
  //   a.setAttribute("href", url);
  //   a.setAttribute("download", filename);
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  const [searchQuery, setSearchQuery] = useState("");
  const filterusers = users.filter((user) =>
    String(user.username).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <UserManageCard title={"Manage Users | Add | Update "}>
        <Box width="100%" overflow="auto">
          <>
            {add === false && edit === false ? (
              <>
                <StyledTable>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <ValidatorForm>
                          <TextValidator
                            label="User Name"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            name="pen_number"
                            value={searchQuery}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                        </ValidatorForm>
                      </TableCell>
                      <TableCell align="center">Email</TableCell>
                      <TableCell align="center">Phone No.</TableCell>
                      <TableCell align="center">Role</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="right">
                        {user.role === "SUPER ADMIN" ? <>Action|</> : null}
                        <Button onClick={addNew}>Add New</Button>
                        {/* <Button onClick={handleDownLoad}>Download</Button> */}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterusers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user1) => (
                        <TableRow key={user1.id}>
                          {" "}
                          {/* Use user.id instead of index */}
                          <TableCell
                            align="center"
                            sx={{ textTransform: "lowercase" }}
                          >
                            {user1.username.toLowerCase()}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ textTransform: "lowercase" }}
                          >
                            {user1.email}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ textTransform: "lowercase" }}
                          >
                            {user1.mobile}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ textTransform: "lowercase" }}
                          >
                            {user1.role.toLowerCase()}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ textTransform: "lowercase" }}
                          >
                            {user1.status.toLowerCase()}
                          </TableCell>
                          {user.role === "SUPER ADMIN" ? (
                            <TableCell align="right">
                              <Tooltip title="Edit" arrow>
                                <IconButton
                                  onClick={() => updateUser(user1.id)}
                                >
                                  <EditIcon sx={{ color: "green" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Block" arrow>
                                <IconButton
                                  onClick={() => handleBlock(user1.id)}
                                >
                                  <BlockIcon sx={{ color: "#fb5f4a" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Approve" arrow>
                                <IconButton
                                  onClick={() => handleApprove(user1.id)}
                                >
                                  <CheckCircleOutlineIcon
                                    sx={{ color: "green" }}
                                  />
                                </IconButton>
                              </Tooltip>

                              {/* <Tooltip title="Delete" arrow>
                          <IconButton
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip> */}
                            </TableCell>
                          ) : (
                            <TableCell></TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </StyledTable>
                <TablePagination
                  sx={{ px: 2 }}
                  page={page}
                  component="div"
                  rowsPerPage={rowsPerPage}
                  count={filterusers.length}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[5, 10, 25]}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  nextIconButtonProps={{ "aria-label": "Next Page" }}
                  backIconButtonProps={{ "aria-label": "Previous Page" }}
                />
              </>
            ) : edit === true && add === false ? (
              <>
                <ValidatorForm onSubmit={handleUpdateUser} onError={() => null}>
                  <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                      <TextValidator
                        type="text"
                        name="id"
                        label="User ID"
                        onChange={handleChangeEdit}
                        value={user1.id}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        sx={{ mb: 2 }}
                      />

                      <TextValidator
                        type="text"
                        name="username"
                        label="Username"
                        onChange={handleChangeEdit}
                        value={user1.username}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextValidator
                        type="text"
                        name="first_name"
                        label="First Name"
                        onChange={handleChangeEdit}
                        value={user1.first_name}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextValidator
                        type="text"
                        name="last_name"
                        label="Last Name"
                        onChange={handleChangeEdit}
                        value={user1.last_name}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextValidator
                        type="Date"
                        name="birthday"
                        label="Birth Day"
                        onChange={handleChangeEdit}
                        value={user1.birthday}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <FormControl
                        component="fieldset"
                        sx={{ display: "flex", mb: 2 }}
                      >
                        <FormLabel
                          component="legend"
                          sx={{ mb: 1, color: "black" }}
                        >
                          Gender <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <RadioGroup
                          row
                          name="gender"
                          value={user1.gender}
                          defaultValue="Male"
                          onChange={handleChangeEdit}
                          sx={{ justifyContent: "flex-start" }}
                        >
                          <FormControlLabel
                            value="Male"
                            control={<Radio color="secondary" />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="Female"
                            control={<Radio color="secondary" />}
                            label="Female"
                          />
                        </RadioGroup>
                      </FormControl>

                      <TextValidator
                        type="Email"
                        name="email"
                        label="Email"
                        onChange={handleChangeEdit}
                        value={user1.email}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextValidator
                        type="Password"
                        name="password"
                        label="Password"
                        onChange={handleChangeEdit}
                        value={user1.password}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                      <TextValidator
                        type="text"
                        name="mobile"
                        label="Phone No."
                        onChange={handleChangeEdit}
                        value={user1.mobile}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        type="text"
                        name="region"
                        label="Region"
                        onChange={handleChangeEdit}
                        value={user1.region}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        type="text"
                        name="zone"
                        label="Zone"
                        onChange={handleChangeEdit}
                        value={user1.zone}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        type="text"
                        name="kebele"
                        label="Kebele"
                        onChange={handleChangeEdit}
                        value={user1.kebele}
                        fullWidth
                        sx={{ mb: 2 }}
                      />

                      <TextValidator
                        type="text"
                        name="organization"
                        label="Organization"
                        onChange={handleChangeEdit}
                        value={user1.organization}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextValidator
                        type="text"
                        name="status"
                        label="Status"
                        onChange={handleChangeEdit}
                        value={user1.status}
                        InputProps={{
                          readOnly: true,
                        }}
                        validators={["required"]}
                        errorMessages={["This field is required"]}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={user1.role || ""}
                          label="Role"
                          onChange={handleChangeEdit}
                        >
                          <MenuItem value="SUPER ADMIN">Super Admin</MenuItem>
                          <MenuItem value="ADMIN">Admin</MenuItem>
                          <MenuItem value="USER">User</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Tooltip title="Back">
                    <IconButton
                      onClick={handleBack}
                      sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.200" },
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                  </Tooltip>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    sx={{
                      backgroundColor: "#30BA4E",
                      "&:hover": {
                        backgroundColor: "#28A745",
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
              </>
            ) : (
              <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Grid container spacing={6}>
                  <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <TextValidator
                      type="text"
                      name="username"
                      label="Username"
                      onChange={handleChange}
                      value={formData.username}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextValidator
                      type="text"
                      name="first_name"
                      label="First Name"
                      onChange={handleChange}
                      value={formData.first_name}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextValidator
                      type="text"
                      name="last_name"
                      label="Last Name"
                      onChange={handleChange}
                      value={formData.last_name}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextValidator
                      type="Date"
                      name="birthday"
                      label="Birth Day"
                      onChange={handleChange}
                      value={formData.birthday}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <FormControl
                      component="fieldset"
                      sx={{ display: "flex", mb: 2 }}
                    >
                      <FormLabel
                        component="legend"
                        sx={{ mb: 1, color: "black" }}
                      >
                        Gender <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <RadioGroup
                        row
                        name="gender"
                        value={formData.gender}
                        defaultValue="Male"
                        onChange={handleChange}
                        sx={{ justifyContent: "flex-start" }}
                      >
                        <FormControlLabel
                          value="Male"
                          control={<Radio color="secondary" />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio color="secondary" />}
                          label="Female"
                        />
                      </RadioGroup>
                    </FormControl>

                    <TextValidator
                      type="Email"
                      name="email"
                      label="Email"
                      onChange={handleChange}
                      value={formData.email}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextValidator
                      type="Password"
                      name="password"
                      label="Password"
                      onChange={handleChange}
                      value={formData.password}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <TextValidator
                      type="text"
                      name="mobile"
                      label="Phone No."
                      onChange={handleChange}
                      value={formData.mobile}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      type="text"
                      name="region"
                      label="Region"
                      onChange={handleChange}
                      value={formData.region}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      type="text"
                      name="zone"
                      label="Zone"
                      onChange={handleChange}
                      value={formData.zone}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      type="text"
                      name="kebele"
                      label="Kebele"
                      onChange={handleChange}
                      value={formData.kebele}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    <TextValidator
                      type="text"
                      name="organization"
                      label="Organization"
                      onChange={handleChange}
                      value={formData.organization}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    {/* <TextValidator
                                            type="text"
                                            name="status"
                                            label="Status"
                                            onChange={handleChange}
                                            value={formData.status}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            validators={["required"]}
                                            errorMessages={["This field is required"]}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                        /> */}
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role || ""}
                        label="Role"
                        onChange={handleChange}
                      >
                        <MenuItem value="SUPER ADMIN">Super Admin</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="USER">User</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Tooltip title="Back">
                  <IconButton
                    onClick={handleBack}
                    sx={{
                      bgcolor: "white",
                      "&:hover": { bgcolor: "grey.200" },
                    }}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                </Tooltip>
                &nbsp;&nbsp;&nbsp;
                <Button
                  sx={{
                    backgroundColor: "#30BA4E",
                    "&:hover": {
                      backgroundColor: "#28A745",
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
            )}
          </>
        </Box>
      </UserManageCard>
    </Container>
  );
};

export default ManageUser;
