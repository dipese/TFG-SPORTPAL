/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import SearchBar from '../searchBar';
import Modal from '../modal';
import CreateTeam from '../../pages/createTeam';
import SearchResults from '../../pages/searchResults';

// eslint-disable-next-line react/prop-types
const Header = ({ style }) => {
    const { logout, user } = useAuth();
    const [isModalEquipoOpen, setIsModalEquipoOpen] = useState(false);
    const [isModalBuscarOpen, setIsModalBuscarOpen] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [busquedaUsuario, setBusquedaUsuario] = useState(true);

    const openModalEquipo = () => setIsModalEquipoOpen(true);
    const closeModalEuipo = () => setIsModalEquipoOpen(false);

    const openModalBuscar = () => setIsModalBuscarOpen(true);
    const closeModalBuscar = () => setIsModalBuscarOpen(false);

    const handleSearchResults = (results) => {
        setSearchResults(results);
        openModalBuscar();
    };

    style = { ...styles.header, ...style };

    return (
        <header style={style }>
            {user ? (
                <div style={styles.searchBar}>
                    <SearchBar onSearch={handleSearchResults} setBusquedaUsuario={setBusquedaUsuario}/>
                </div>
            ): <div></div>
            }
            
            <div style={styles.buttons}>
                {user ? (
                    <>
                        
                        <button style={styles.button} onClick={openModalEquipo}>Crear Equipo</button>
                        <button style={styles.button} onClick={() => window.location.href = '/createEvent'}>Crear Evento</button>
                        <button style={styles.button} onClick={() => logout()} >Cerrar Sesión</button>
                        <button style={styles.button} onClick={() => window.location.href = '/profile'} ><p>{user.username}</p></button>
                    </>
                ) : (
                    <button style={styles.button} onClick={() => window.location.href = '/login'}>Iniciar Sesión</button>
                )}
            </div>
            <Modal isOpen={isModalEquipoOpen} onClose={closeModalEuipo}>
                <CreateTeam />
            </Modal>
            <Modal isOpen={isModalBuscarOpen} onClose={closeModalBuscar}>
                <SearchResults results={searchResults} busquedaUsuario={busquedaUsuario} />
            </Modal>
        </header>
    );
};

// Estilos en línea para el componente Header
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f5f5f5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: 'Roboto, sans-serif',
        
    },
    searchBar: {
        fontFamily: 'Roboto, sans-serif',
    },
    buttons: {
        display: 'flex',
        fontFamily: 'Roboto, sans-serif',
    },
    button: {
        padding: '5px 10px',
        margin: '0 5px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        fontFamily: 'Roboto, sans-serif',
        width: '100px', // Ajusta el tamaño de los botones aquí
    },
};

export default Header;