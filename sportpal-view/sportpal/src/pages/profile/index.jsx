/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Avatar, Grid, Button } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import API from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import Modal from '../../componets/modal';
import Chat from '../../pages/chat';

const client = API.instance();

const sports = await client.getSports();

const Profile = () => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
    const [solicitantes, setSolicitantes] = useState([]);
    const [amigos, setAmigos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [isModalChatOpen, setIsModalChatOpen] = useState(false);
    const [chat , setChat] = useState([]);
    const [nombreChat, setNombreChat] = useState('');

    // Estado local para controlar si se están mostrando las opciones de edición
    const [editingEnabled, setEditingEnabled] = useState(false);

    const openModalChat = () => setIsModalChatOpen(true);
    const closeModalChat = () => setIsModalChatOpen(false);
    
    const handleAbrirChat = async (id, nombre, team) => {
        if (team) {
            const chat = await client.getChatTeam(id);
            setChat(chat);
            setNombreChat('Chat de ' + nombre);
        } else {
            const chat = await client.getChatFriend(id);
            setChat(chat);
            setNombreChat('Chat con ' + nombre);
        }
        openModalChat();
    };


    // Manejador de eventos para el botón de editar
    const handleEditClick = () => {
        setEditingEnabled(true);
    };

    const fetchSolicitantes = async () => {
        const solicitantesData = await Promise.all(
            userData.friendRequests.map(async (request) => {
                const response = await client.getUsers({ _id: request });
                return response; // Asumiendo que response ya es el usuario deseado
            })
        );
        setSolicitantes(solicitantesData);
    }

    const fetchAmigos = async () => {
        const amigosData = await Promise.all(
            userData.friends.map(async (friend) => {
                const response = await client.getUsers({ _id: friend });
                return response; // Asumiendo que response ya es el usuario deseado
            }
        ));
        setAmigos(amigosData);
    }

    const fetchEquipos = async () => {
        const equiposData = await Promise.all(
            userData.teams.map(async (team) => {
                const response = await client.getTeams({ _id: team });
                return response; // Asumiendo que response ya es el equipo deseado
            })
        );
        setEquipos(equiposData);
    }


    useEffect(() => {
        
        fetchSolicitantes();
        fetchAmigos();
        fetchEquipos();
    }, []); // Dependencias del useEffect

    const acceptFriendRequest = async (friendId) => {
        const response = await client.acceptFriendRequest(friendId);
        if (response) {
            setSolicitantes((prevSolicitantes) =>
                prevSolicitantes.filter((solicitante) => solicitante[0]._id !== friendId)
            );
            
            setUserData((prevUserData) => {
                const updatedUserData = {
                    ...prevUserData,
                    friends: [...prevUserData.friends, friendId],
                    friendRequests: prevUserData.friendRequests.filter((request) => request !== friendId),
                };
    
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                return updatedUserData;
            });
                const amigo = await client.getUsers({ _id: friendId });
                // Asegúrate de agregar el amigo como un array de un solo elemento si esa es la estructura esperada
                setAmigos((prevAmigos) => [...prevAmigos, amigo]);
        }
    };

    const deleteFriend = async (friendId) => {
        const response = await client.deleteFriend(friendId);
        if (response) {
            setAmigos((prevAmigos) =>
                prevAmigos.filter((amigo) => amigo[0]._id !== friendId)
            );
            setUserData((prevUserData) => {
                const updatedUserData = {
                    ...prevUserData,
                    friends: prevUserData.friends.filter((friend) => friend !== friendId),
                };
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                return updatedUserData;
            });

        }
    };

    const rejectFriendRequest = async (friendId) => {
        const response = await client.rejectFriendRequest(friendId);
        if (response) {
            setSolicitantes((prevSolicitantes) =>
                prevSolicitantes.filter((solicitante) => solicitante[0]._id !== friendId)
            );
            setUserData((prevUserData) => {
                const updatedUserData = {
                    ...prevUserData,
                    friendRequests: prevUserData.friendRequests.filter((request) => request !== friendId),
                };
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                return updatedUserData;
            });
        }
    };

    
    return (
        <>
        <Container maxWidth="sm">
            <Card sx={{ mt: 5 }}>
                <CardContent>
                    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={2}>
                        <Grid item>
                            <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56 }}>
                                {userData.username[0].toUpperCase()}
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" component="h2">
                                Mi Perfil
                            </Typography>
                        </Grid>
                        <Grid item>
                            {editingEnabled ? (
                                <input type="text" value={userData.username} />
                            ) : (
                                <Typography color="textSecondary">
                                    Nombre: {userData.username}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item>
                            {editingEnabled ? (
                                <input type="text" value={userData.email} />
                            ) : (
                                <Typography color="textSecondary">
                                    Email: {userData.email}
                                </Typography>
                            )}
                        </Grid>
                    
                        {/* Botones de salir y editar */}
                        <Grid item>
                            <Button component={Link} to="/" variant="contained" color="primary">
                                Salir
                            </Button>
                            <span style={{ margin: '0 8px' }}></span> {/* Add this line for horizontal separation */}
                            {editingEnabled ? (
                                <Button variant="contained" color="secondary">
                                    Guardar
                                </Button>
                            ) : (
                                <Button onClick={handleEditClick} variant="contained" color="secondary">
                                    Editar
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* amigos */}
            <Card sx={{ mt: 5 }}>
                <CardContent>
                    <Typography variant="h6" component="h3">
                        Amigos:
                    </Typography>
                    {amigos.map((amigo) => (
                        <Grid container key={amigo[0]._id} alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item>
                                <Typography color="textSecondary">
                                    {amigo[0].username}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box display="flex" gap={1}>
                                    <Button onClick={() => handleAbrirChat(amigo[0]._id, amigo[0].username, false)}>
                                        <FontAwesomeIcon icon={faMessage}  />
                                    </Button>
                                    <Button onClick={()=> deleteFriend (amigo[0]._id)}>
                                        <FontAwesomeIcon icon={faUserMinus} />
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    ))}
                </CardContent>
            </Card>

            {/* solicitudes de amistad */}
            <Card sx={{ mt: 5 }}>
                <CardContent>
                    <Typography variant="h6" component="h3">
                        Solicitudes de amistad:
                    </Typography>

                    {solicitantes.map((solicitante) => (
                        <Grid container key={solicitante[0]._id} alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item>
                                <Typography color="textSecondary">
                                    {solicitante[0].username}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box display="flex" gap={1}>
                                    <Button onClick={() => acceptFriendRequest(solicitante[0]._id)}>
                                        <FontAwesomeIcon icon={faCircleCheck} />
                                    </Button>
                                    <Button onClick={() => rejectFriendRequest(solicitante[0]._id)}>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    ))}
                </CardContent>
            </Card>

            {/* Nuevo contenedor para equipos */}
            <Card sx={{ mt: 5 }}>
                <CardContent>
                    <Typography variant="h6" component="h3">
                        Equipos:
                    </Typography>
                    {equipos.map((equipo) => (
                        <Grid container key={equipo[0]._id} alignItems="center" justifyContent="space-between" spacing={1}>
                            <Grid item>
                                <Typography color="textSecondary">
                                    {equipo[0].name}, {sports.find((sport) => sport._id === equipo[0].sport)?.name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box display="flex" gap={1}>
                                    <Button onClick={() => handleAbrirChat(equipo[0]._id, equipo[0].name, true)}>
                                        <FontAwesomeIcon icon={faMessage}  />
                                    </Button>
                                    <Button>
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    ))}
                </CardContent>
            </Card>
        </Container>
        <Modal isOpen={isModalChatOpen} onClose={closeModalChat}>
            <Chat chat={chat[0]} nombreChat={nombreChat} />
        </Modal>
        </>
    );
};

export default Profile;