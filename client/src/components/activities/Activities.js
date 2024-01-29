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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Box  from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const columns = [
  {id: 'name', label: 'Name', minWidth: 170},
  {id: 'action', label: 'Action', minWidth: 50}
]

function createData(name, description) {
  return { name, description };
}

function Activities() {

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const getActivities = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get('/activity/activitylist');
        const convertedRows = response.data.map(ele => createData(ele.name, ele.description, ele.activity));
        isMounted && setRows(convertedRows);
        setIsLoading(false);
      } catch(err) {
        console.error(err);
        setIsLoading(false);
      }
    }
    getActivities();
    return () => {
      isMounted = false;
    }
  }, [axiosPrivate, navigate, location]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleActivityEdit = (activityname) => {
    navigate(`/editactivity/${activityname}`);
  }

  return(
    <div>
      { !isLoading ? (
        <Paper sx={{ width: '30%', overflow: 'hidden', marginTop: '50px', marginLeft: '35%' }}>
          <Button sx={{ margin: '5px', float: 'right' }} onClick={() => navigate('/createactivity')} variant="contained" color="primary">CREATE ACTIVITY</Button>
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
                                : column.id === 'action' ? <div style={{ display: 'flex', flexDirection: 'row' }}><EditIcon sx={{ cursor: 'pointer', marginRight: '5px' }} onClick={()=> handleActivityEdit(row['name'])} /> <DeleteForeverIcon sx={{ cursor: 'pointer' }} onClick={()=> handleActivityEdit(row['name'])} /></div> : value}

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
        </Paper> )
        :(
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        )
      }
    </div>
  )
}

export default Activities;