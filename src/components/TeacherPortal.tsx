import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import { PiStudentFill } from 'react-icons/pi';
import { AiOutlineUser } from 'react-icons/ai';
import { Tooltip } from '@mui/material';
import Header from './Header';

interface Column {
  id: 'name' | 'subject' | 'marks' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

interface Student {
  _id: number;
  name: string;
  subject: string;
  marks: number;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'subject', label: 'Subject', minWidth: 100 },
  {
    id: 'marks',
    label: 'Marks',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toString(),
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'right',
  },
];

const TeacherPortal: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'delete'>('add');
  const [newStudent, setNewStudent] = useState({ name: '', subject: '', marks: 0 });
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get<Student[]>("https://tailwebs-backend.onrender.com/student", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch student data',
        });
      });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setDialogType('add');
    setOpenDialog(true);
  };

  const handleEditClick = () => {
    if (selectedStudent) {
      setDialogType('edit');
      setNewStudent({
        name: selectedStudent.name,
        subject: selectedStudent.subject,
        marks: selectedStudent.marks,
      });
      setOpenDialog(true);
    }
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setDialogType('delete');
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = () => {
    if (dialogType === 'add') {
      axios.post('https://tailwebs-backend.onrender.com/student/add', newStudent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setStudents([...students, response.data.student]);
          if(response.data.newRegister) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Student added successfully',
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Student is already exist and marks has been updated',
            });
          }
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add student',
          });
        });
    } else if (dialogType === 'edit' && selectedStudent) {
      axios.put(`https://tailwebs-backend.onrender.com/student/update/${selectedStudent._id}`, newStudent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setStudents(students.map(student => student._id === selectedStudent._id ? response.data : student));
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Student updated successfully',
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update student',
          });
        });
    } else if (dialogType === 'delete' && selectedStudent) {
      axios.delete(`https://tailwebs-backend.onrender.com/student/delete/${selectedStudent._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setStudents(students.filter(student => student._id !== selectedStudent._id));
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Student deleted successfully',
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete student',
          });
        });
    }

    setOpenDialog(false);
    setNewStudent({ name: '', subject: '', marks: 0 });
  };

  useEffect(() => {
    axios.get<Student[]>("https://tailwebs-backend.onrender.com/student", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setStudents(response.data);
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch student data',
      });
    });
  }, [students])

  const renderInitialIcon = (name: string) => {
    const initial = name.charAt(0).toUpperCase();
    return (
      <Tooltip title={name} arrow>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {initial}
          </div>
          {name}
        </div>
      </Tooltip>
    );
  };

  return (
    <div>
      <Header />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Button sx={{ backgroundColor: 'black', color: 'white', margin: 2 }} onClick={handleAddClick} variant='outlined' color='secondary'>
          Add Student
        </Button>
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
              {students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={student._id}>
                    {columns.map((column) => {
                      const value = student[column.id as keyof Student];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'name' ? (
                            renderInitialIcon(student.name)
                          ) : column.id === 'action' ? (
                            <>
                              <Button onClick={(event) => handleActionClick(event, student)}>
                                <PiStudentFill />
                              </Button>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                              >
                                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                              </Menu>
                            </>
                          ) : (
                            column.format && typeof value === 'number'
                              ? column.format(value)
                              : value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{dialogType === 'delete' ? 'Confirm Deletion' : dialogType === 'edit' ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogContent>
            {dialogType === 'delete' ? (
              <p>Are you sure you want to delete {selectedStudent?.name}?</p>
            ) : (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  fullWidth
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Subject"
                  fullWidth
                  value={newStudent.subject}
                  onChange={(e) => setNewStudent({ ...newStudent, subject: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Marks"
                  fullWidth
                  type="number"
                  value={newStudent.marks}
                  inputProps={{ min: 0, max: 100 }}
                  onChange={(e) => setNewStudent({ ...newStudent, marks: +e.target.value })}
                  error={newStudent.marks < 0 || newStudent.marks > 100}
                  helperText={newStudent.marks < 0 ? 'Marks cannot be negative' : newStudent.marks > 100 ? 'Marks cannot exceed 100' : ''}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSubmit}>{dialogType === 'delete' ? 'Delete' : 'Submit'}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
}

export default TeacherPortal;
