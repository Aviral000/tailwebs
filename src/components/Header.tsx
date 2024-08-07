import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between" }}>
      <h1>tailwebs.</h1>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
