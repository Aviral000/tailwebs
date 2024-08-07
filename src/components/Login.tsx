import React, { useState, FormEvent } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import '../styles/Login.scss';
import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  token: string;
  isLoggedIn: boolean;
  isNew: boolean;
}

interface ErrorResponse {
  error: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('http://127.0.0.1:8082/teacher/login', {
        username,
        password
      });

      const { isLoggedIn, isNew, token } = response.data;

      if (isLoggedIn) {
        if (isNew) {
          Swal.fire({
            title: 'Welcome!',
            text: 'New teacher registered successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Success!',
            text: 'Logged in successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
        localStorage.setItem('token', token);
        navigate("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      Swal.fire({
        title: 'Error!',
        text: axiosError.response?.data?.error || 'An error occurred during login',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Container>
      <h1 className='heading'>tailwebs.</h1>
      <Typography variant="h4" className='login'>Login</Typography>
      <form className='form' onSubmit={handleSubmit}>
        <TextField
          id='username'
          label="Username"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            marginTop: "1rem"
          }}
        />
        <TextField
          id='password'
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem"
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ backgroundColor: "black", width: "50%" }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;