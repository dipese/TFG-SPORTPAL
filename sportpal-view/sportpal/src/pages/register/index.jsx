/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Link as MuiLink } from '@mui/material';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
  

const Register = () => {
    const { register, user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        username : '',
        nombre: '',
        apellidos: '',
        password: '',
        confirmPassword: '',
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        const { confirmPassword, ...fields } = formData;
        e.preventDefault();
        await register(fields);
        console.log(fields);
    };

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <Container component="main" maxWidth="xs">
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Registro
                </Typography>
                <form onSubmit={handleSubmit} style={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Correo Electrónico"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Nombre de usuario"
                                autoFocus
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="nombre"
                                required
                                fullWidth
                                id="nombre"
                                label="Nombre"
                                autoFocus
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="apellidos"
                                required
                                fullWidth
                                id="apellidos"
                                label="Apellidos"
                                autoFocus
                                value={formData.apellidos}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirmar Contraseña"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ mt: 3, mb: 2,  marginTop: '10px' }}
                    >
                        Registrarse
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <MuiLink component={Link} to="/login" variant="body2">
                                {"¿Ya tienes una cuenta? Inicia sesión"}
                            </MuiLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default Register;