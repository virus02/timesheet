import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  {id: 'fullName', label: 'Full Name', minWidth: 170},
  {id: 'role', label: 'Role', minWidth: 170},
  {id: 'email', label: 'Email', minWidth: 170},
  {id: 'department', label: 'Department', minWidth: 170},
  {id: 'projects', label: 'Projects', minWidth: 170},
  {id: 'action', label: 'Action', minWidth: 50}
]

function createData(fullName, roles, email, department, project) {
  const projects = project.toString();
  const role = roles === 0 ? 'User' : 'Admin';
  return { fullName, role, email, department, projects };
}

function Users() {

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/userList');
        const result = await response.json();
        const convertedRows = result.map(ele => createData(ele.fullName, ele.role, ele.email, ele.department, ele.projects));
        setRows(convertedRows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUserEdit = (email) => {
    navigate(`/edituser/${email}`);
  }

  return(
    <Paper sx={{ width: '75%', overflow: 'hidden', marginTop: '10px', marginLeft: '12%' }}>
      <Button sx={{ margin: '5px', float: 'right' }} onClick={() => navigate('/createuser')} variant="contained" color="primary">Create User</Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : column.id === 'action' ? <EditIcon sx={{ cursor: 'pointer' }} onClick={()=> handleUserEdit(row['email'])} /> : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default Users;