/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import { Navigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Grid, Link as MuiLink, Alert } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit} style={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item>
              <MuiLink component={Link} to="/register" variant="body2">
                {"¿No tienes una cuenta? Regístrate"}
              </MuiLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Login;