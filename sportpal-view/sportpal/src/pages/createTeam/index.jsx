/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import API from '../../api';

const baseStyles = {
    fontFamily: "'Roboto', sans-serif",
    color: '#333',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const formStyle = {
    ...baseStyles,
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'lightgray',
};

const inputStyle = {
    ...baseStyles,
    border: '1px solid #ccc',
    marginBottom: '10px',
    width: 'calc(100% - 40px)', // 20px padding on each side
    height: '40px',
};

const selectStyle = {
    ...inputStyle,
    width: '100%',
    height: '60px',
};

const buttonStyle = {
    ...baseStyles,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
        backgroundColor: '#0056b3',
    },
    ':focus': {
        outline: '2px solid #0056b3',
        outlineOffset: '2px',
    },
    flex: 1
};

const CreateTeam = () => {
    const [formData, setFormData] = useState({ name: '', sport: '' });
    const [sports, setSports] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSports = async () => {
            const sportsData = await API.instance().getSports();
            setSports(sportsData || []);
        };

        fetchSports();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validación básica
        let newErrors = {};
        if (!formData.name) newErrors.name = 'El nombre es obligatorio';
        if (!formData.sport) newErrors.sport = 'El deporte es obligatorio';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const response = await API.instance().createTeam({
                name: formData.name,
                sport: formData.sport,
            });
            if (response) {
                const user = JSON.parse(localStorage.getItem('user'));
                user.teams.push(response._id);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/'; 
            } else {
                alert('Error al crear el equipo');
            }
        }
    };

    return (
        <div style={formStyle}>
            <h2>Crear Equipo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </div>
                <div>
                    <label>Deporte:</label>
                    <select
                        name="sport"
                        value={formData.sport}
                        onChange={handleChange}
                        style={selectStyle}
                    >
                        <option value="">Seleccionar</option>
                        {sports.map((sport) => (
                            <option key={sport._id} value={sport._id}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                    {errors.sport && <p style={{ color: 'red' }}>{errors.sport}</p>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                    <button style={buttonStyle} type="submit">
                        Crear Equipo
                    </button>
                    <button style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '10px' }} onClick={() => window.location.href = '/'}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTeam;