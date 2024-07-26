/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import API from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus, faUser, faEye, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../componets/modal';
import Chat from '../chat';

const client = API.instance()

const sports = await client.getSports();

const SearchResults = ({ results, busquedaUsuario }) => {
    const [isModalChatOpen, setIsModalChatOpen] = useState(false);
    const [chat , setChat] = useState([]);
    const [nombreChat, setNombreChat] = useState('');
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));

    const openModalChat = () => setIsModalChatOpen(true);
    const closeModalChat = () => setIsModalChatOpen(false);


    if (results.length === 0) {
        return <div style={styles.noResults}>No hay resultados para mostrar.</div>;
    }

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

    const enviarSolitudAmistad = async (id) => {
        await client.enviarSolicitudAmistad(id);
    }

    const solicitarUnirseEquipo = async (id) => {
        await client.solicitarUnirseEquipo(id);
        userData.teams.push(id);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    if (busquedaUsuario) {
        return (
            <>
            <div style={styles.resultsContainer}>
                {results.map((result, index) => {
                    const [selectedSport, setSelectedSport] = useState(result.elo[0]?.sport || '');
                    const selectedElo = result.elo.find(e => e.sport === selectedSport)?.elo || 'N/A';
                    const areFriends = result.friends.includes(userData._id)
                    const solicito = result.friendRequests.includes(userData._id)
    
                    return (
                        <div key={index} style={styles.resultCard}>
                            <p style={styles.username}>{result.username}</p>
                            <hr style={styles.separator} />
                            <p style={styles.property}>Nombre: <span style={styles.value}>{result.nombre}</span></p>
                            <hr style={styles.separator} />
                            <p style={styles.property}>Apellidos: <span style={styles.value}>{result.apellidos}</span></p>
                            <hr style={styles.separator} />
                            <div style={styles.eloContainer}>
                                <p style={styles.property}>ELO: </p>
                                <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} style={styles.select}>
                                    {result.elo.map((e, i) => (
                                        <option key={i} value={e.sport}>{sports.find(s => s._id === e.sport)?.name}</option>
                                    ))}
                                </select>
                                <p style={styles.value}>{selectedElo}</p>
                            </div>
                            <hr style={styles.separator} />
                            {areFriends ? (
                                <button style={styles.iconButton} onClick={() => handleAbrirChat (result._id, result.username, false)}>
                                    <FontAwesomeIcon icon={faMessage} />
                                </button>
                            ) : solicito ? (
                                <button style={styles.iconButton} onClick={() => console.log('Cancelar solicitud')}>
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                            ) : (
                                <button style={styles.iconButton} onClick={() => enviarSolitudAmistad(result._id)}>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            <Modal isOpen={isModalChatOpen} onClose={closeModalChat}>
                <Chat chat={chat[0]} nombreChat={nombreChat} />
            </Modal>
            </>
        );
    } else {
        return (
            <>
            <div style={styles.resultsContainer}>
                {results.map((team, index) => {
                    console.log (team)
                    const pertece = team.players.includes(userData._id)

                    return (
                        <div key={index} style={styles.resultCard}>
                            <p style={styles.username}>{team.name}</p>
                            <hr style={styles.separator} />
                            <p style={styles.property}><span style={styles.value}>{sports.find(s => s._id === team.sport)?.name || 'N/A'}</span></p>
                            <hr style={styles.separator} />
                            <p style={styles.property}>ELO: <span style={styles.value}>{team.elo}</span></p>
                            <hr style={styles.separator} />
                            {pertece ? (
                                <button style={styles.iconButton} onClick={() => handleAbrirChat (team._id, team.name, true)}>
                                    <FontAwesomeIcon icon={faMessage} />
                                </button>
                            ) : (
                                <button style={styles.iconButton} onClick={() => solicitarUnirseEquipo (team._id)}>
                                    <FontAwesomeIcon icon={faPeopleGroup} />
                                </button>
                            )}
                            <button style={styles.iconButton}>
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            
                        </div>
                    ); 
            })}
            </div>
            <Modal isOpen={isModalChatOpen} onClose={closeModalChat}>
                <Chat chat={chat[0]} nombreChat={nombreChat} />
             </Modal>
            </>
        );
    }
};

const styles = {
    resultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '30px',
    },
    resultCard: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        backgroundColor: '#F0F4F8', // Actualizado
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        width: '90%',
        marginBottom: '15px',
    },
    username: {
        fontWeight: 'bold',
        color: '#4A90E2', // Actualizado
        fontSize: '18px',
    },
    property: {
        fontFamily: "'Open Sans', sans-serif",
        color: '#333333', // Mantenido
        fontSize: '16px',
        display: 'inline',
        marginRight: '5px',
    },
    value: {
        fontFamily: "'Open Sans', sans-serif",
        color: '#555555', // Mantenido
        fontSize: '16px',
        display: 'inline',
    },
    eloContainer: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        width: '100%',
    },
    select: {
        fontFamily: "'Open Sans', sans-serif",
        color: '#333333', // Mantenido
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #BECDE5', // Actualizado
        backgroundColor: '#E8F0FE', // Actualizado
        fontSize: '16px',
        width: '150px',
    },
    noResults: {
        fontFamily: "'Open Sans', sans-serif",
        color: '#333333', // Mantenido
        textAlign: 'center',
        marginTop: '30px',
        fontSize: '18px',
    },
    separator: {
        margin: '10px 0',
        border: '0',
        height: '1px',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0))',
    },
    iconButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

export default SearchResults;