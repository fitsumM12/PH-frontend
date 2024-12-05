import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Table, styled, TableRow, TableBody, TableCell, TableHead, IconButton, TablePagination } from "@mui/material";
import UserManageCard from 'app/views/components/UserManageCard';
import UserView from '../forms/UserView';
import { getUsers, blockUser, approveUser, deleteUser } from 'app/apis/users_api';
import useAppContext from "app/hooks/useAppContext";
import UserForm from '../forms/UserForm';
// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
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


export default function ManageUser() {

    // DEFINE CONSTANTS AND HOOKS INITIALIZATIONS
    const [page, setPage] = useState(0);
    const { state, dispatch } = useAppContext();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [change, setChange] = useState(false)
    const [ userId, setuserId] = useState(0)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
        setChange(false)
    }, [change]);

    const handleBlock = async (userId) => {
        try {
            await blockUser(userId);
            setChange(true)
        } catch (error) {
            console.log(error)
        }
    };

    const handleApprove = async (userId) => {
        try {
            await approveUser(userId);
            setChange(true)
        } catch (error) {
            console.log(error)
        }
    };

    const handleDeleteUser = async (userId) =>{
        try {
            await deleteUser(userId);
            setChange(true)
        } catch (error) {
            console.log(error)
        }
    };
    const handleUserView = (userId) => {
        setuserId(userId)
        dispatch({ type: 'TOGGLE_VIEW_USER' })
    }
    
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
  
    return (
        <Container>
            <UserManageCard title="Manage User">
                {!state.add_new_user && !state.view_user? (<Box width="100%" overflow="auto">
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                {/* <TableCell align="left">First Name</TableCell> */}
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Role</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user, index) => (
                                    <TableRow key={index}>
                                        {/* <TableCell align="left">{user.firstname}</TableCell> */}
                                        <TableCell align="center">{user.email.toLowerCase()}</TableCell>
                                        <TableCell align="center">{user.role}</TableCell>
                                        <TableCell align="center">{user.status}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Block">
                                                <IconButton onClick={() => handleBlock(user.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                    <BlockIcon sx={{color:'#fb5f4a'}}/>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Approve">
                                                <IconButton onClick={() => handleApprove(user.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                    
                                                <CheckCircleOutlineIcon sx={{color:'green'}}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View">
                                                <IconButton onClick={() => handleUserView(user.id)} sx={{ '&:hover': { bgcolor: 'grey.200' } }}>
                                                    <VisibilityIcon sx={{color:'#7c80f1'}}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDeleteUser(user.id)} sx={{'&:hover': {bgcolor:'grey.200'}}}>
                                                <DeleteIcon sx={{color:'red'}}/>
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
                        count={users.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </Box>) : (
                    <UserForm/>             
                )}

            </UserManageCard>
        </Container>
    );
}

    