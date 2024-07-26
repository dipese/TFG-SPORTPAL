/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import API from '../../api';

const client = API.instance();

const SearchBar = ({ onSearch, setBusquedaUsuario }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Usuarios');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let results = null;
        if (searchTerm === '') {
            return;
        }
        if (searchType === 'Usuarios') {
            setBusquedaUsuario(true);
            results = await client.buscarUsuarios( searchTerm);
        } else if (searchType === 'Equipos') {
            setBusquedaUsuario(false);
            results = await client.buscarEquipos( searchTerm );
        }
        onSearch(results);
    };

    return (
        <form style={styles.form} onSubmit={handleFormSubmit}>
            <input style={styles.input}
                type="text"
                placeholder={`Buscar ${searchType.toLowerCase()} por nombre...`}
                value={searchTerm}
                onChange={handleInputChange}
            />
            <select style={styles.select} value={searchType} onChange={handleTypeChange}>
                <option value="Usuarios">Usuarios</option>
                <option value="Equipos">Equipos</option>
            </select>
            <button style={styles.button} type="submit">Buscar</button>
        </form>
    );
};

const styles = {
    form: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '5px',
    },
    input: {
        border: 'none',
        padding: '5px',
        fontSize: '16px',
        width: '250px',
    },
    select: {
        marginLeft: '10px',
        padding: '5px 10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'lightgrey',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px',

    },
};

export default SearchBar;